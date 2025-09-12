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
    // Use SQL to efficiently get first image per category
    const { data: images, error } = await supabase.rpc('get_featured_images_by_category')

    if (error) {
      console.error('Database error:', error)
      // Fallback to slower method if RPC function doesn't exist
      return await getFeaturedImagesFallback()
    }

    // Transform to expected format
    const featuredImages: { [key: string]: any } = {}
    images?.forEach((image: any) => {
      featuredImages[image.category_id] = image
    })

    const response = NextResponse.json({
      success: true,
      featured: featuredImages
    })

    // Aggressive caching since featured images don't change often
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=7200')

    return response

  } catch (error) {
    console.error('API error:', error)
    return await getFeaturedImagesFallback()
  }
}

// Fallback method - more efficient than before
async function getFeaturedImagesFallback() {
  try {
    // Get distinct categories first
    const { data: categories } = await supabase
      .from('images')
      .select('category_id')
      .order('category_id')

    if (!categories) {
      return NextResponse.json({ success: true, featured: {} })
    }

    // Get unique categories
    const uniqueCategories = Array.from(new Set(categories.map(c => c.category_id)))

    // Get first image for each category efficiently
    const featuredPromises = uniqueCategories.map(async (categoryId) => {
      const { data } = await supabase
        .from('images')
        .select('id, title, download_url, thumbnail_url, category_id, created_at')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return { categoryId, image: data }
    })

    const results = await Promise.all(featuredPromises)
    
    const featuredImages: { [key: string]: any } = {}
    results.forEach(({ categoryId, image }) => {
      if (image) {
        featuredImages[categoryId] = image
      }
    })

    const response = NextResponse.json({
      success: true,
      featured: featuredImages
    })

    response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400')
    return response

  } catch (error) {
    console.error('Fallback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 