import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const imageSlug = searchParams.get('slug')
    
    if (!categorySlug || !imageSlug) {
      return NextResponse.json(
        { success: false, error: 'Category and slug parameters are required' },
        { status: 400 }
      )
    }

    // First, get the category ID from the category slug
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Query for single image by slug (if slug column exists) or by title slug
    let foundImage = null;
    let relatedImages = [];

    // First try to query by slug column if it exists
    const { data: imageBySlug, error: slugError } = await supabase
      .from('images')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('category_id', category.id)
      .eq('slug', imageSlug)
      .single()

    if (imageBySlug && !slugError) {
      foundImage = imageBySlug;
    } else {
      // Fallback: query by title slug (temporary until slug column is added)
      const { data: images, error: imagesError } = await supabase
        .from('images')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('category_id', category.id)
        .limit(50)

      if (imagesError) {
        console.error('Database error:', imagesError)
        return NextResponse.json(
          { success: false, error: 'Database error' },
          { status: 500 }
        )
      }

      // Find the image by title slug
      foundImage = images?.find((img) => {
        const titleSlug = img.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        return titleSlug === imageSlug
      })

      if (foundImage) {
        // Get related images from the same category
        relatedImages = images
          ?.filter(img => img.id !== foundImage.id)
          .slice(0, 4) || []
      }
    }

    if (!foundImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // If we found by slug column, get related images separately
    if (imageBySlug && !slugError) {
      const { data: relatedData } = await supabase
        .from('images')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('category_id', category.id)
        .neq('id', foundImage.id)
        .limit(4)
      
      relatedImages = relatedData || []
    }

    return NextResponse.json({
      success: true,
      image: foundImage,
      relatedImages
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
