#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Function to ensure unique slug
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const { data: existing } = await supabase
      .from('images')
      .select('id')
      .eq('slug', slug)
      .neq('id', excludeId || '')
      .single();
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function addSlugsFromTitles() {
  console.log('🔄 Adding slugs from titles...');
  
  try {
    // Get all images
    const { data: images, error: fetchError } = await supabase
      .from('images')
      .select('id, title, slug');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 Found ${images.length} images`);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const image of images) {
      try {
        // Skip if already has slug
        if (image.slug) {
          skipped++;
          continue;
        }
        
        const baseSlug = createSlug(image.title);
        const uniqueSlug = await ensureUniqueSlug(baseSlug, image.id);
        
        const { error: updateError } = await supabase
          .from('images')
          .update({ slug: uniqueSlug })
          .eq('id', image.id);
        
        if (updateError) {
          console.log(`❌ Failed to update ${image.title}: ${updateError.message}`);
          errors++;
        } else {
          console.log(`✅ Updated: ${image.title} → ${uniqueSlug}`);
          updated++;
        }
      } catch (error) {
        console.log(`❌ Error processing ${image.title}: ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n🎉 Slug addition completed!');
    console.log(`✅ Updated: ${updated} images`);
    console.log(`⏭️  Skipped: ${skipped} images (already had slugs)`);
    console.log(`❌ Errors: ${errors} images`);
    
  } catch (error) {
    console.error('💥 Failed:', error.message);
    process.exit(1);
  }
}

// Run the script
addSlugsFromTitles();
