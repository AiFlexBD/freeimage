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
    // Get category counts efficiently using SQL
    const { data: categoryCounts, error } = await supabase
      .from('images')
      .select('category_id, id')
      .order('category_id')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch category statistics' },
        { status: 500 }
      )
    }

    // Count images per category
    const stats: { [key: string]: number } = {}
    categoryCounts?.forEach(image => {
      stats[image.category_id] = (stats[image.category_id] || 0) + 1
    })

    // Add cache headers
    const response = NextResponse.json({
      success: true,
      stats
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