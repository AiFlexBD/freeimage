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

async function migrateImageSlugs() {
  console.log('🔄 Starting image slug migration...');
  
  try {
    // Get all images without slugs
    const { data: images, error: fetchError } = await supabase
      .from('images')
      .select('id, title, slug')
      .is('slug', null);
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 Found ${images.length} images to migrate`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const image of images) {
      try {
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
          console.log(`✅ Migrated: ${image.title} → ${uniqueSlug}`);
          migrated++;
        }
      } catch (error) {
        console.log(`❌ Error processing ${image.title}: ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n🎉 Migration completed!');
    console.log(`✅ Successfully migrated: ${migrated} images`);
    console.log(`❌ Errors: ${errors} images`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateImageSlugs();

