import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // First get current download count
    const { data: currentImage, error: fetchError } = await supabase
      .from('images')
      .select('downloads')
      .eq('id', imageId)
      .single()

    if (fetchError) {
      console.error('Fetch image error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to find image' },
        { status: 404 }
      )
    }

    // Update download count
    const { error: updateError } = await supabase
      .from('images')
      .update({ 
        downloads: (currentImage.downloads || 0) + 1
      })
      .eq('id', imageId)

    if (updateError) {
      console.error('Download count update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to track download' },
        { status: 500 }
      )
    }

    // Optionally create download record for analytics
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      await supabase
        .from('downloads')
        .insert({
          id: `dl_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          image_id: imageId,
          ip_address: ip,
          user_agent: userAgent
        })
    } catch (err) {
      // Don't fail the main request if download tracking fails
      console.error('Download record creation failed:', err)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 