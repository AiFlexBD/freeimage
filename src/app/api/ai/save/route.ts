import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Save API: Starting request...')
    
    const { imageData, prompt, categoryId, title, description } = await request.json()
    console.log('Save API: Request data received:', { 
      hasImageData: !!imageData, 
      prompt: prompt?.substring(0, 50), 
      categoryId, 
      title 
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
        tags: ['ai-generated', 'gemini'],
        width: 1024, // Default, could be extracted from image
        height: 1024, // Default, could be extracted from image
        file_size: buffer.length,
        download_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        downloads: 0,
        is_featured: false
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
    console.log('Save API: Creating AI generation record with ID:', generationId)
    
    const { error: genError } = await supabase
      .from('ai_generations')
      .insert({
        id: generationId,
        user_id: null, // Could be set if user is logged in
        prompt: prompt,
        style: 'gemini-2.5-flash',
        quality: 'standard',
        aspect_ratio: '1:1',
        generated_images: [{ url: publicUrl, image_id: imageId }],
        status: 'completed'
      })

    if (genError) {
      console.error('Save API: AI generation record error:', genError)
      // Don't fail the whole request for this
    }

    console.log('Save API: Success! Returning response')
    return NextResponse.json({
      success: true,
      image: imageRecord,
      message: 'Image saved successfully to gallery'
    })

  } catch (error) {
    console.error('Save API: Unexpected error:', error)
    return NextResponse.json(
      { error: `Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 