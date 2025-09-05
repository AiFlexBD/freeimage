import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Clean and prepare search term - escape special characters
    const searchTerm = query.trim().toLowerCase().replace(/[%_\\]/g, '\\$&')
    
    if (searchTerm.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      )
    }

    console.log('Searching for:', searchTerm)

    // Search in multiple fields using PostgreSQL ILIKE for case-insensitive search
    const { data: images, error: searchError } = await supabase
      .from('images')
      .select(`
        id,
        title,
        description,
        download_url,
        thumbnail_url,
        category_id,
        downloads,
        tags,
        created_at
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_id.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json(
        { error: 'Failed to search images', details: searchError.message },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('images')
      .select('id', { count: 'exact', head: true })
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_id.ilike.%${searchTerm}%`)

    if (countError) {
      console.error('Count error:', countError)
    }

    // Also search by category name if the search term matches a category
    const categorySearchResults = await searchByCategory(searchTerm, limit, offset)
    
    // Combine and deduplicate results
    const allResults = [...(images || []), ...(categorySearchResults || [])]
    const uniqueResults = allResults.filter((image, index, self) => 
      index === self.findIndex(i => i.id === image.id)
    )

    // Sort by relevance (exact matches first, then by creation date)
    const sortedResults = uniqueResults.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase().includes(searchTerm) || 
                         a.description?.toLowerCase().includes(searchTerm)
      const bExactMatch = b.title.toLowerCase().includes(searchTerm) || 
                         b.description?.toLowerCase().includes(searchTerm)
      
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    console.log(`Found ${sortedResults.length} results for "${query}"`)

    return NextResponse.json({
      success: true,
      results: sortedResults.slice(0, limit),
      total: count || sortedResults.length,
      query: query,
      page: Math.floor(offset / limit) + 1,
      hasMore: sortedResults.length > limit
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to search by category name
async function searchByCategory(searchTerm: string, limit: number, offset: number) {
  try {
    // Define category mappings
    const categoryMappings: { [key: string]: string } = {
      'nature': 'nature',
      'natural': 'nature',
      'landscape': 'nature',
      'outdoor': 'nature',
      'mountain': 'nature',
      'forest': 'nature',
      'ocean': 'nature',
      'business': 'business',
      'corporate': 'business',
      'office': 'business',
      'work': 'business',
      'meeting': 'business',
      'technology': 'technology',
      'tech': 'technology',
      'computer': 'technology',
      'digital': 'technology',
      'charging': 'technology',
      'station': 'technology',
      'electric': 'technology',
      'food': 'food',
      'cooking': 'food',
      'kitchen': 'food',
      'meal': 'food',
      'restaurant': 'food',
      'people': 'people',
      'person': 'people',
      'human': 'people',
      'portrait': 'people',
      'family': 'people',
      'abstract': 'abstract',
      'art': 'abstract',
      'pattern': 'abstract',
      'design': 'abstract',
      'geometric': 'abstract',
      'travel': 'travel',
      'vacation': 'travel',
      'tourism': 'travel',
      'destination': 'travel',
      'trip': 'travel',
      'lifestyle': 'lifestyle',
      'home': 'lifestyle',
      'living': 'lifestyle',
      'daily': 'lifestyle',
      'interior': 'lifestyle'
    }

    const categoryId = categoryMappings[searchTerm]
    
    if (!categoryId) {
      return []
    }

    const { data: categoryImages, error } = await supabase
      .from('images')
      .select(`
        id,
        title,
        description,
        download_url,
        thumbnail_url,
        category_id,
        downloads,
        tags,
        created_at
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Category search error:', error)
      return []
    }

    return categoryImages || []
  } catch (error) {
    console.error('Category search helper error:', error)
    return []
  }
} 