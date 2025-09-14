#!/usr/bin/env node

/**
 * Migration script to move all images from Supabase Storage to AWS S3
 * 
 * Prerequisites:
 * 1. AWS CLI configured with credentials
 * 2. S3 bucket created
 * 3. Environment variables set
 * 
 * Usage: node scripts/migrate-to-s3.js
 */

const { createClient } = require('@supabase/supabase-js');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const path = require('path');

// Configuration
const CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  aws: {
    bucket: process.env.AWS_S3_BUCKET || 'imagegenfree-images',
    region: process.env.AWS_REGION || 'us-east-1',
    cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN || null // e.g., 'd123456789.cloudfront.net'
  }
};

// Initialize clients
const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceKey);
const s3 = new AWS.S3({ region: CONFIG.aws.region });

// Statistics tracking
const stats = {
  totalImages: 0,
  migrated: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * Main migration function
 */
async function migrateImages() {
  console.log('🚀 Starting image migration from Supabase to AWS S3...\n');
  
  try {
    // 1. Get all images from database
    console.log('📋 Fetching all images from database...');
    const { data: images, error } = await supabase
      .from('images')
      .select('id, title, download_url, thumbnail_url, category_id, width, height')
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    stats.totalImages = images.length;
    console.log(`Found ${stats.totalImages} images to migrate\n`);

    // 2. Process images in batches
    const batchSize = 5; // Process 5 images at a time
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      await Promise.all(batch.map(image => processImage(image, i + batch.indexOf(image) + 1)));
      
      // Progress update
      console.log(`Progress: ${Math.min(i + batchSize, images.length)}/${images.length} images processed`);
    }

    // 3. Final report
    printFinalReport();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Process a single image
 */
async function processImage(image, index) {
  try {
    console.log(`\n[${index}] Processing: ${image.title}`);
    
    // Skip if already migrated (check if URL is already S3)
    if (image.download_url && image.download_url.includes('amazonaws.com')) {
      console.log('  ⏭️  Already migrated, skipping...');
      stats.skipped++;
      return;
    }

    // Download image from Supabase
    console.log('  📥 Downloading from Supabase...');
    const imageBuffer = await downloadImage(image.download_url);
    
    if (!imageBuffer) {
      throw new Error('Failed to download image');
    }

    // Generate optimized versions
    console.log('  🔧 Generating optimized versions...');
    const optimizedImages = await generateOptimizedVersions(imageBuffer, image);

    // Upload to S3
    console.log('  ☁️  Uploading to S3...');
    const s3Urls = await uploadToS3(optimizedImages, image);

    // Update database
    console.log('  💾 Updating database...');
    await updateDatabase(image.id, s3Urls);

    console.log('  ✅ Successfully migrated!');
    stats.migrated++;

  } catch (error) {
    console.error(`  ❌ Failed to migrate ${image.title}:`, error.message);
    stats.failed++;
    stats.errors.push({
      image: image.title,
      error: error.message
    });
  }
}

/**
 * Download image from Supabase
 */
async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
}

/**
 * Generate high-quality versions of the image (preserving maximum quality)
 */
async function generateOptimizedVersions(buffer, image) {
  const versions = {};

  try {
    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    // Original (preserve exact quality, convert to WebP only if beneficial)
    if (metadata.format === 'png' || metadata.format === 'jpeg') {
      // Convert to WebP with lossless compression for PNG, high quality for JPEG
      versions.original = await sharp(buffer)
        .webp({ 
          quality: metadata.format === 'png' ? 100 : 98,  // Max quality
          lossless: metadata.format === 'png',             // Lossless for PNG
          effort: 6                                        // Max compression effort
        })
        .toBuffer();
    } else {
      // Keep original format if it's already optimized
      versions.original = buffer;
    }

    // Only create smaller versions if original is large enough
    // Thumbnail (400x300) - only if original is larger
    if (originalWidth > 400 || originalHeight > 300) {
      versions.thumbnail = await sharp(buffer)
        .resize(400, 300, { 
          fit: 'cover',
          withoutEnlargement: true  // Don't enlarge smaller images
        })
        .webp({ 
          quality: 95,              // High quality for thumbnails
          effort: 6 
        })
        .toBuffer();
    }

    // Medium (800x600) - only if original is larger
    if (originalWidth > 800 || originalHeight > 600) {
      versions.medium = await sharp(buffer)
        .resize(800, 600, { 
          fit: 'cover',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 97,              // Very high quality
          effort: 6 
        })
        .toBuffer();
    }

    // Large (1200x800) - only if original is larger
    if (originalWidth > 1200 || originalHeight > 800) {
      versions.large = await sharp(buffer)
        .resize(1200, 800, { 
          fit: 'cover',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 98,              // Near-lossless quality
          effort: 6 
        })
        .toBuffer();
    }

    console.log(`    Generated ${Object.keys(versions).length} versions (original: ${originalWidth}x${originalHeight})`);
    return versions;
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Upload images to S3
 */
async function uploadToS3(versions, image) {
  const urls = {};
  const baseKey = `images/${image.category_id}/${image.id}`;

  try {
    for (const [size, buffer] of Object.entries(versions)) {
      const key = `${baseKey}/${size}.webp`;
      
      await s3.upload({
        Bucket: CONFIG.aws.bucket,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          originalTitle: image.title,
          category: image.category_id,
          size: size
        }
      }).promise();

      // Generate URL (CloudFront if available, otherwise S3)
      if (CONFIG.aws.cloudfrontDomain) {
        urls[size] = `https://${CONFIG.aws.cloudfrontDomain}/${key}`;
      } else {
        urls[size] = `https://${CONFIG.aws.bucket}.s3.${CONFIG.aws.region}.amazonaws.com/${key}`;
      }
    }

    return urls;
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Update database with new S3 URLs
 */
async function updateDatabase(imageId, s3Urls) {
  try {
    const { error } = await supabase
      .from('images')
      .update({
        download_url: s3Urls.original,
        thumbnail_url: s3Urls.thumbnail,
        // Store additional sizes in metadata
        metadata: {
          s3_urls: s3Urls
        }
      })
      .eq('id', imageId);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }
}

/**
 * Print final migration report
 */
function printFinalReport() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 MIGRATION COMPLETE');
  console.log('='.repeat(50));
  console.log(`Total images: ${stats.totalImages}`);
  console.log(`✅ Successfully migrated: ${stats.migrated}`);
  console.log(`⏭️  Skipped (already migrated): ${stats.skipped}`);
  console.log(`❌ Failed: ${stats.failed}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(err => {
      console.log(`  - ${err.image}: ${err.error}`);
    });
  }

  // Cost estimation
  const totalMigrated = stats.migrated * 4; // 4 versions per image
  const estimatedCost = (totalMigrated * 0.0004).toFixed(2); // Rough S3 storage cost
  console.log(`\n💰 Estimated monthly S3 cost: $${estimatedCost}`);
  
  console.log('\n🎉 Migration completed successfully!');
  
  if (CONFIG.aws.cloudfrontDomain) {
    console.log(`🌐 Images now served via CloudFront: https://${CONFIG.aws.cloudfrontDomain}/`);
  } else {
    console.log(`🌐 Images now served from S3: https://${CONFIG.aws.bucket}.s3.${CONFIG.aws.region}.amazonaws.com/`);
  }
}

// Run migration if called directly
if (require.main === module) {
  // Check required environment variables
  if (!CONFIG.supabase.url || !CONFIG.supabase.serviceKey) {
    console.error('❌ Missing required Supabase environment variables');
    process.exit(1);
  }

  migrateImages().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { migrateImages }; 