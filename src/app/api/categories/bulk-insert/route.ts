import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { categories } = await request.json()
    
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories array is required' },
        { status: 400 }
      )
    }

    console.log(`Inserting ${categories.length} categories...`)

    // Insert categories with upsert (ON CONFLICT DO UPDATE)
    const { data, error } = await supabase
      .from('categories')
      .upsert(categories, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to insert categories', details: error.message },
        { status: 500 }
      )
    }

    console.log(`Successfully inserted/updated ${categories.length} categories`)

    return NextResponse.json({
      success: true,
      message: `Successfully inserted/updated ${categories.length} categories`,
      categories: data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 