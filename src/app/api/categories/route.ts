import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeImageCount = searchParams.get('includeImageCount') === 'true'
    const slug = searchParams.get('slug')
    
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    // If slug is provided, filter by slug
    if (slug) {
      query = query.eq('slug', slug)
    }
    
    // If we need image counts, we'll need to join with images table
    if (includeImageCount) {
      query = supabase
        .from('categories')
        .select(`
          *,
          images(count)
        `)
        .order('sort_order', { ascending: true })
      
      if (slug) {
        query = query.eq('slug', slug)
      }
    }
    
    const { data: categories, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }
    
    // Transform the data if we included image counts
    const transformedCategories = categories?.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_count: includeImageCount ? (category.images?.[0]?.count || 0) : category.image_count || 0,
      featured_image: category.featured_image,
      sort_order: category.sort_order,
      created_at: category.created_at,
      updated_at: category.updated_at
    })) || []
    
    // If slug was provided, return single category with success wrapper
    if (slug) {
      const category = transformedCategories[0]
      if (category) {
        return NextResponse.json({
          success: true,
          category: category
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'Category not found'
        }, { status: 404 })
      }
    }
    
    // Otherwise return all categories
    return NextResponse.json(transformedCategories)
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
