import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Environment check:', { hasUrl, hasKey })
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: { hasUrl, hasKey }
      })
    }
    
    // Test storage bucket access
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('Bucket list error:', bucketError)
      return NextResponse.json({
        success: false,
        error: 'Failed to list buckets',
        details: bucketError
      })
    }
    
    console.log('Available buckets:', buckets)
    
    // Check if images bucket exists
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
    
    // Test database connection
    const { data: categories, error: dbError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(3)
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: dbError
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
        imagesBucketExists: !!imagesBucket,
        sampleCategories: categories
      }
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 