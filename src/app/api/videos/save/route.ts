import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Video Save API: Starting request...')
    
    const { videoData, prompt, categoryId, title, description, tags, duration, slug } = await request.json()
    console.log('Video Save API: Request data received:', { 
      hasVideoData: !!videoData, 
      prompt: prompt?.substring(0, 50), 
      categoryId, 
      title,
      duration
    })

    if (!videoData || !prompt || !categoryId) {
      return NextResponse.json(
        { error: 'Video data, prompt, and category are required' },
        { status: 400 }
      )
    }

    // Generate unique video ID
    const videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const filename = `${videoId}.mp4`

    // Convert base64 to buffer
    const base64Data = videoData.replace(/^data:video\/mp4;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filename, buffer, {
        contentType: 'video/mp4',
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Video Save API: Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filename)

    // Get thumbnail URL (first frame)
    const thumbnailFilename = `${videoId}_thumb.jpg`
    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(thumbnailFilename)

    // Save to database
    const { data: videoRecord, error: dbError } = await supabase
      .from('videos')
      .insert({
        id: videoId,
        title: title || `AI Generated: ${prompt.substring(0, 50)}...`,
        description: description || `Generated with Azure OpenAI Sora: ${prompt}`,
        filename: filename,
        category_id: categoryId,
        tags: tags || ['ai-generated', 'sora'],
        duration: duration || 10,
        file_size: buffer.length,
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        downloads: 0,
        is_featured: false,
        slug: slug
      })
      .select()
      .single()

    if (dbError) {
      console.error('Video Save API: Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save video record' },
        { status: 500 }
      )
    }

    console.log('Video Save API: Successfully saved video:', videoId)
    
    return NextResponse.json({
      success: true,
      video: videoRecord,
      message: 'Video saved successfully'
    })

  } catch (error) {
    console.error('Video Save API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    )
  }
}
