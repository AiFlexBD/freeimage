import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get one image per category for thumbnails
    const { data: images, error } = await supabase
      .from('images')
      .select(`
        id,
        title,
        download_url,
        thumbnail_url,
        category_id,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch featured images' },
        { status: 500 }
      )
    }

    // Get first image for each category
    const featuredImages: { [key: string]: any } = {}
    images?.forEach(image => {
      if (!featuredImages[image.category_id]) {
        featuredImages[image.category_id] = image
      }
    })

    // Add cache headers
    const response = NextResponse.json({
      success: true,
      featured: featuredImages
    })

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')

    return response

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 