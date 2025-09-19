import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Function to get image dimensions from base64 data
async function getImageDimensions(base64Data: string): Promise<{ width: number; height: number }> {
  try {
    // Remove data URL prefix
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')
    
    // For PNG files, we can extract dimensions from the header
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    // IHDR chunk starts at byte 8, width at bytes 16-19, height at bytes 20-23
    if (buffer.length > 24) {
      // Check if it's a PNG file
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        const width = buffer.readUInt32BE(16)
        const height = buffer.readUInt32BE(20)
        return { width, height }
      }
    }
    
    // Fallback: return default dimensions
    return { width: 1024, height: 1024 }
  } catch (error) {
    console.error('Error extracting image dimensions:', error)
    return { width: 1024, height: 1024 }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Save API: Starting request...')
    
    const { imageData, prompt, categoryId, title, description, tags, dimensions, slug } = await request.json()
    console.log('Save API: Request data received:', { 
      hasImageData: !!imageData, 
      prompt: prompt?.substring(0, 50), 
      categoryId, 
      title,
      dimensions
    })

    // Validate input
    if (!imageData || !prompt || !categoryId) {
      console.log('Save API: Validation failed')
      return NextResponse.json(
        { error: 'Image data, prompt, and category are required' },
        { status: 400 }
      )
    }

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Save API: Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase credentials' },
        { status: 500 }
      )
    }

    console.log('Save API: Converting base64 to buffer...')
    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    console.log('Save API: Buffer created, size:', buffer.length)
    
    // Get actual image dimensions
    const imageDimensions = dimensions || await getImageDimensions(imageData)
    console.log('Save API: Image dimensions:', imageDimensions)
    
    // Generate unique filename
    const timestamp = Date.now()
    const filename = `ai-generated/${timestamp}-${Math.random().toString(36).substring(7)}.png`
    console.log('Save API: Generated filename:', filename)
    
    console.log('Save API: Uploading to Supabase storage...')
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Save API: Upload error details:', uploadError)
      return NextResponse.json(
        { error: `Failed to upload image to storage: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log('Save API: Upload successful:', uploadData)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename)

    const publicUrl = urlData.publicUrl
    console.log('Save API: Public URL generated:', publicUrl)

    // Generate thumbnail URL (same as main image for now)
    const thumbnailUrl = publicUrl

    // Create image record in database
    const imageId = `img_${timestamp}_${Math.random().toString(36).substring(7)}`
    console.log('Save API: Creating database record with ID:', imageId)
    
    const { data: imageRecord, error: dbError } = await supabase
      .from('images')
      .insert({
        id: imageId,
        title: title || `AI Generated: ${prompt.substring(0, 50)}...`,
        description: description || `Generated with Gemini 2.5 Flash: ${prompt}`,
        filename: filename,
        category_id: categoryId,
        tags: tags || ['ai-generated', 'gemini'],
        width: imageDimensions.width,
        height: imageDimensions.height,
        file_size: buffer.length,
        download_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        downloads: 0,
        is_featured: false,
        slug: slug
      })
      .select()
      .single()

    if (dbError) {
      console.error('Save API: Database error details:', dbError)
      // Try to clean up uploaded file
      console.log('Save API: Cleaning up uploaded file...')
      await supabase.storage.from('images').remove([filename])
      
      return NextResponse.json(
        { error: `Failed to save image to database: ${dbError.message}` },
        { status: 500 }
      )
    }

    console.log('Save API: Image record created:', imageRecord)

    // Also save to ai_generations table
    const generationId = `gen_${timestamp}_${Math.random().toString(36).substring(7)}`
    const { error: genError } = await supabase
      .from('ai_generations')
      .insert({
        id: generationId,
        image_id: imageId,
        prompt: prompt,
        model: 'gemini-2.5-flash-image-preview',
        settings: {
          quality: 'ai-generated',
          aspectRatio: 'custom',
          width: imageDimensions.width,
          height: imageDimensions.height
        },
        created_at: new Date().toISOString()
      })

    if (genError) {
      console.error('Save API: Generation record error:', genError)
      // Don't fail the main request for this
    }

    console.log('Save API: Success! Returning response...')
    return NextResponse.json({
      success: true,
      image: imageRecord,
      message: `Image saved successfully at ${imageDimensions.width}×${imageDimensions.height} resolution!`
    })

  } catch (error) {
    console.error('Save API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to save image' },
      { status: 500 }
    )
  }
} 