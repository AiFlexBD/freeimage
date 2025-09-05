import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    console.log('Setting up storage bucket...')
    
    // Create the images bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 52428800 // 50MB
    })
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Bucket creation error:', bucketError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create bucket',
        details: bucketError
      })
    }
    
    console.log('Bucket created or already exists:', bucket)
    
    // Test upload with a small test file
    const testBuffer = Buffer.from('test image data')
    const testFilename = `test-${Date.now()}.txt`
    
    const { data: uploadTest, error: uploadError } = await supabase.storage
      .from('images')
      .upload(testFilename, testBuffer, {
        contentType: 'text/plain',
      })
    
    if (uploadError) {
      console.error('Test upload error:', uploadError)
      return NextResponse.json({
        success: false,
        error: 'Bucket created but upload test failed',
        details: uploadError
      })
    }
    
    // Clean up test file
    await supabase.storage.from('images').remove([testFilename])
    
    // Verify bucket now exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const imagesBucket = buckets?.find(b => b.name === 'images')
    
    return NextResponse.json({
      success: true,
      message: 'Storage bucket setup complete',
      data: {
        bucketCreated: !!bucket,
        bucketExists: !!imagesBucket,
        testUploadWorked: !!uploadTest
      }
    })
    
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during setup',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 