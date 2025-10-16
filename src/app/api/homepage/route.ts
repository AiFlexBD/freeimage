import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { categories } from '@/data/categories'

// Force dynamic rendering
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Parallel fetch all data needed for homepage
    const [imagesResult, statsResult, featuredResult] = await Promise.allSettled([
      // Get recent images
      supabase
        .from('images')
        .select(`
          id,
          title,
          description,
          download_url,
          thumbnail_url,
          category_id,
          tags,
          width,
          height,
          downloads,
          is_featured,
          created_at,
          categories (
            id,
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false })
        .limit(12),

      // Get category counts
      supabase
        .from('images')
        .select('category_id, id')
        .order('category_id'),

      // Get featured images for categories (optimized query)
      getFeaturedImagesOptimized()
    ])

    // Process results
    const images = imagesResult.status === 'fulfilled' && imagesResult.value.data ? imagesResult.value.data : []
    const allImages = statsResult.status === 'fulfilled' && statsResult.value.data ? statsResult.value.data : []
    const featuredImages = featuredResult.status === 'fulfilled' ? featuredResult.value : {}

    // Calculate category stats
    const stats: { [key: string]: number } = {}
    allImages.forEach((image: any) => {
      stats[image.category_id] = (stats[image.category_id] || 0) + 1
    })

    // Combine category data - show all categories, not just those with images
    const categoriesWithImages = categories.map(category => {
      const imageCount = stats[category.id] || 0
      const featuredImage = featuredImages[category.id] || null
      
      return {
        ...category,
        imageCount,
        featuredImage
      }
    })

    // Sort categories to prioritize stunning ones and those with images
    const stunningCategories = ['anime', 'space', 'pixel-art', 'aesthetic', 'medieval', 'music', 'lofi-music']
    
    categoriesWithImages.sort((a, b) => {
      // First priority: stunning categories
      const aIsStunning = stunningCategories.includes(a.id)
      const bIsStunning = stunningCategories.includes(b.id)
      
      if (aIsStunning && !bIsStunning) return -1
      if (!aIsStunning && bIsStunning) return 1
      
      // Second priority: categories with images
      if (a.imageCount > 0 && b.imageCount === 0) return -1
      if (a.imageCount === 0 && b.imageCount > 0) return 1
      
      // Third priority: image count (descending)
      return b.imageCount - a.imageCount
    })

    const response = NextResponse.json({
      success: true,
      data: {
        images,
        categories: categoriesWithImages,
        totalImages: allImages.length,
        totalCategories: Object.keys(stats).length
      }
    })

    // Aggressive caching for homepage data
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600')

    return response

  } catch (error) {
    console.error('Homepage API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optimized function to get featured images
async function getFeaturedImagesOptimized(): Promise<{ [key: string]: any }> {
  try {
    // Get unique categories first
    const { data: categoryData } = await supabase
      .from('images')
      .select('category_id')
      .order('category_id')

    if (!categoryData) return {}

    const uniqueCategories = Array.from(new Set(categoryData.map(c => c.category_id)))

    // Get first image for each category in parallel
    const featuredPromises = uniqueCategories.map(async (categoryId) => {
      const { data } = await supabase
        .from('images')
        .select('id, title, download_url, thumbnail_url, category_id, created_at')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      return { categoryId, image: data }
    })

    const results = await Promise.all(featuredPromises)
    
    const featuredImages: { [key: string]: any } = {}
    results.forEach(({ categoryId, image }) => {
      if (image) {
        featuredImages[categoryId] = image
      }
    })

    return featuredImages

  } catch (error) {
    console.error('Featured images error:', error)
    return {}
  }
} 