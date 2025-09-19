#!/usr/bin/env node

/**
 * Generate images for categories that have few or no images
 * Focuses on categories with less than 20 images
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories that need more images (less than 20 images each)
const categoriesToGenerate = [
  { name: 'architecture', target: 25, current: 8 },
  { name: 'business', target: 25, current: 10 },
  { name: 'food', target: 25, current: 10 },
  { name: 'people', target: 25, current: 10 },
  { name: 'travel', target: 25, current: 10 },
  { name: 'abstract', target: 25, current: 11 },
  { name: 'nature', target: 25, current: 12 },
  { name: 'technology', target: 25, current: 13 },
  { name: 'science', target: 25, current: 18 },
  { name: 'healthcare', target: 25, current: 19 },
  { name: 'music', target: 25, current: 19 }
];

// High-quality prompts for each category
const categoryPrompts = {
  architecture: [
    "Ultra-realistic architectural photography of modern glass skyscraper with geometric patterns reflecting golden hour light. Shot with Canon EOS R5, 24-70mm lens, f/8, shallow depth of field, high-resolution, cinematic detail, crisp textures, professional architectural photography",
    "Stunning contemporary building facade with clean lines and dramatic shadows. Captured with Sony A7R IV, 16-35mm wide-angle lens, f/11, perfect exposure, high-resolution, architectural detail, professional real estate photography",
    "Futuristic building design with innovative materials and sustainable features. Photographed with Nikon Z9, 14-24mm lens, f/9, golden hour lighting, high-resolution, architectural photography, magazine quality",
    "Historic building restoration with modern elements blending seamlessly. Shot with Canon EOS R6, 50mm lens, f/5.6, natural lighting, high-resolution, architectural detail, professional photography",
    "Minimalist modern home with clean geometric forms and natural materials. Captured with Sony A7R V, 35mm lens, f/7.1, soft natural light, high-resolution, architectural photography, lifestyle magazine quality"
  ],
  business: [
    "Professional business meeting in modern conference room with glass walls and city view. Shot with Canon EOS R5, 85mm lens, f/2.8, natural lighting, high-resolution, corporate photography, professional atmosphere",
    "Successful entrepreneur working in sleek modern office with laptop and coffee. Captured with Sony A7R IV, 50mm lens, f/4, soft window light, high-resolution, business lifestyle photography, magazine quality",
    "Handshake between business partners in contemporary office lobby. Photographed with Nikon Z9, 70-200mm lens, f/5.6, professional lighting, high-resolution, corporate photography, authentic moment",
    "Team collaboration in open-plan office with natural light and modern furniture. Shot with Canon EOS R6, 24-70mm lens, f/6.3, ambient lighting, high-resolution, workplace photography, professional quality",
    "Business presentation with charts and graphs on large screen in boardroom. Captured with Sony A7R V, 35mm lens, f/8, controlled lighting, high-resolution, corporate photography, professional atmosphere"
  ],
  food: [
    "Gourmet dish presentation with fresh ingredients and artistic plating. Shot with Canon EOS R5, 100mm macro lens, f/4, natural lighting, high-resolution, food photography, restaurant quality, shallow depth of field",
    "Fresh organic vegetables arranged beautifully on wooden cutting board. Captured with Sony A7R IV, 90mm lens, f/5.6, soft window light, high-resolution, food styling, magazine quality photography",
    "Artisanal bread and pastries in rustic bakery setting with warm lighting. Photographed with Nikon Z9, 85mm lens, f/3.5, natural lighting, high-resolution, food photography, lifestyle magazine quality",
    "Elegant dessert presentation with chocolate and berries on fine china. Shot with Canon EOS R6, 105mm macro lens, f/4.5, controlled lighting, high-resolution, food photography, restaurant quality",
    "Fresh seafood display with lemons and herbs in coastal restaurant setting. Captured with Sony A7R V, 50mm lens, f/6.3, natural lighting, high-resolution, food photography, professional quality"
  ],
  people: [
    "Portrait of diverse professional in natural outdoor setting with soft lighting. Shot with Canon EOS R5, 85mm lens, f/2.8, golden hour light, high-resolution, portrait photography, natural expressions, professional quality",
    "Candid moment of person laughing in urban environment with street photography style. Captured with Sony A7R IV, 50mm lens, f/4, available light, high-resolution, lifestyle photography, authentic emotion",
    "Professional headshot with clean background and natural lighting. Photographed with Nikon Z9, 105mm lens, f/5.6, studio lighting, high-resolution, corporate photography, professional quality",
    "Person reading in cozy cafe with warm ambient lighting and bokeh background. Shot with Canon EOS R6, 50mm lens, f/2.2, natural light, high-resolution, lifestyle photography, intimate moment",
    "Group of friends enjoying outdoor activity with natural expressions and lighting. Captured with Sony A7R V, 35mm lens, f/6.3, daylight, high-resolution, lifestyle photography, authentic moments"
  ],
  travel: [
    "Breathtaking mountain landscape with dramatic clouds and golden hour lighting. Shot with Canon EOS R5, 16-35mm lens, f/11, natural lighting, high-resolution, landscape photography, professional quality",
    "Historic city street with charming architecture and local culture. Captured with Sony A7R IV, 24-70mm lens, f/8, available light, high-resolution, travel photography, documentary style",
    "Tropical beach with crystal clear water and palm trees at sunset. Photographed with Nikon Z9, 14-24mm lens, f/9, golden hour, high-resolution, travel photography, magazine quality",
    "Ancient temple with intricate details and dramatic lighting. Shot with Canon EOS R6, 70-200mm lens, f/6.3, natural light, high-resolution, travel photography, cultural documentation",
    "Urban skyline at night with city lights and long exposure technique. Captured with Sony A7R V, 24mm lens, f/16, long exposure, high-resolution, cityscape photography, professional quality"
  ],
  abstract: [
    "Abstract geometric patterns with vibrant colors and dynamic composition. Shot with Canon EOS R5, 50mm lens, f/8, controlled lighting, high-resolution, abstract photography, artistic composition",
    "Fluid motion captured with long exposure creating ethereal abstract forms. Captured with Sony A7R IV, 85mm lens, f/11, long exposure, high-resolution, abstract photography, artistic expression",
    "Minimalist abstract composition with negative space and subtle textures. Photographed with Nikon Z9, 105mm lens, f/6.3, natural lighting, high-resolution, abstract art, gallery quality",
    "Color field abstraction with bold hues and geometric shapes. Shot with Canon EOS R6, 35mm lens, f/9, studio lighting, high-resolution, abstract photography, modern art style",
    "Textural abstract with organic forms and natural lighting creating depth. Captured with Sony A7R V, 60mm lens, f/7.1, natural light, high-resolution, abstract photography, artistic vision"
  ],
  nature: [
    "Majestic forest with towering trees and dappled sunlight filtering through canopy. Shot with Canon EOS R5, 16-35mm lens, f/11, natural lighting, high-resolution, nature photography, professional quality",
    "Serene lake reflection with mountains and dramatic sky at golden hour. Captured with Sony A7R IV, 24-70mm lens, f/9, natural light, high-resolution, landscape photography, magazine quality",
    "Wildflower meadow with vibrant colors and shallow depth of field. Photographed with Nikon Z9, 105mm macro lens, f/4, natural lighting, high-resolution, nature photography, artistic composition",
    "Waterfall cascading over rocks with long exposure creating silky water effect. Shot with Canon EOS R6, 14-24mm lens, f/16, long exposure, high-resolution, nature photography, professional technique",
    "Autumn forest with colorful leaves and misty atmosphere creating mood. Captured with Sony A7R V, 70-200mm lens, f/8, natural lighting, high-resolution, nature photography, seasonal beauty"
  ],
  technology: [
    "Modern smartphone with sleek design and premium materials in studio lighting. Shot with Canon EOS R5, 100mm macro lens, f/8, controlled lighting, high-resolution, product photography, professional quality",
    "Futuristic computer setup with RGB lighting and modern peripherals. Captured with Sony A7R IV, 50mm lens, f/6.3, ambient lighting, high-resolution, tech photography, lifestyle magazine quality",
    "Abstract circuit board patterns with metallic textures and geometric forms. Photographed with Nikon Z9, 105mm macro lens, f/11, studio lighting, high-resolution, tech photography, artistic composition",
    "Smart home devices integrated seamlessly into modern living space. Shot with Canon EOS R6, 35mm lens, f/7.1, natural lighting, high-resolution, lifestyle photography, technology integration",
    "High-tech laboratory with advanced equipment and clean modern design. Captured with Sony A7R V, 24-70mm lens, f/9, professional lighting, high-resolution, tech photography, scientific atmosphere"
  ],
  science: [
    "Laboratory microscope with scientific samples and professional lighting setup. Shot with Canon EOS R5, 100mm macro lens, f/8, controlled lighting, high-resolution, scientific photography, professional quality",
    "Molecular structure visualization with vibrant colors and geometric patterns. Captured with Sony A7R IV, 50mm lens, f/6.3, studio lighting, high-resolution, scientific illustration, educational quality",
    "Research laboratory with modern equipment and clean scientific environment. Photographed with Nikon Z9, 24-70mm lens, f/9, professional lighting, high-resolution, scientific photography, documentary style",
    "Space exploration concept with planets and stars in cosmic setting. Shot with Canon EOS R6, 14-24mm lens, f/11, controlled lighting, high-resolution, scientific photography, educational content",
    "Chemical reaction in laboratory with colorful solutions and scientific precision. Captured with Sony A7R V, 85mm lens, f/5.6, controlled lighting, high-resolution, scientific photography, educational quality"
  ],
  healthcare: [
    "Modern hospital room with clean design and natural lighting creating healing environment. Shot with Canon EOS R5, 24-70mm lens, f/8, natural lighting, high-resolution, healthcare photography, professional quality",
    "Medical equipment in sterile environment with professional lighting setup. Captured with Sony A7R IV, 50mm lens, f/6.3, controlled lighting, high-resolution, medical photography, documentary style",
    "Healthcare professional in modern clinic with warm, welcoming atmosphere. Photographed with Nikon Z9, 85mm lens, f/4, natural lighting, high-resolution, healthcare photography, professional quality",
    "Wellness center with natural elements and calming design promoting health. Shot with Canon EOS R6, 35mm lens, f/7.1, natural light, high-resolution, healthcare photography, lifestyle magazine quality",
    "Medical research laboratory with advanced technology and scientific precision. Captured with Sony A7R V, 24-70mm lens, f/9, professional lighting, high-resolution, scientific photography, healthcare innovation"
  ],
  music: [
    "Vintage vinyl record player with warm lighting and nostalgic atmosphere. Shot with Canon EOS R5, 50mm lens, f/4, ambient lighting, high-resolution, music photography, lifestyle magazine quality",
    "Musician playing acoustic guitar in intimate setting with natural lighting. Captured with Sony A7R IV, 85mm lens, f/2.8, natural light, high-resolution, music photography, artistic composition",
    "Concert stage with dramatic lighting and musical instruments in performance setting. Photographed with Nikon Z9, 24-70mm lens, f/6.3, stage lighting, high-resolution, music photography, professional quality",
    "Recording studio with professional equipment and creative atmosphere. Shot with Canon EOS R6, 35mm lens, f/7.1, controlled lighting, high-resolution, music photography, professional environment",
    "Piano keys with soft lighting creating artistic musical composition. Captured with Sony A7R V, 105mm macro lens, f/5.6, natural lighting, high-resolution, music photography, artistic detail"
  ]
};

// Generate unique, SEO-friendly titles
const generateUniqueTitle = (category, promptIndex) => {
  const titleTemplates = {
    architecture: [
      "Modern Glass Skyscraper Architecture",
      "Contemporary Building Facade Design",
      "Innovative Urban Structure",
      "Futuristic Architectural Concept",
      "Geometric Building Patterns",
      "Sustainable Architecture Design",
      "Modern Office Complex",
      "Contemporary Residential Building",
      "Innovative Commercial Structure",
      "Urban Development Project",
      "Modern Architectural Marvel",
      "Contemporary Building Innovation",
      "Futuristic Design Concept",
      "Sustainable Building Solution",
      "Modern Construction Project",
      "Contemporary Architecture Style",
      "Innovative Building Technology",
      "Urban Architecture Development"
    ],
    business: [
      "Professional Corporate Meeting",
      "Modern Business Environment",
      "Successful Team Collaboration",
      "Executive Office Space",
      "Corporate Success Story",
      "Professional Business Presentation",
      "Modern Workplace Innovation",
      "Business Strategy Discussion",
      "Corporate Leadership Meeting",
      "Professional Office Environment",
      "Business Growth Planning",
      "Corporate Development Session",
      "Professional Networking Event",
      "Business Innovation Workshop",
      "Executive Decision Making",
      "Corporate Team Building",
      "Professional Business Consultation",
      "Modern Corporate Culture"
    ],
    food: [
      "Gourmet Culinary Artistry",
      "Fresh Organic Food Presentation",
      "Artisanal Cooking Experience",
      "Elegant Restaurant Dining",
      "Professional Food Styling",
      "Gourmet Kitchen Preparation",
      "Fresh Ingredient Showcase",
      "Culinary Masterpiece Creation",
      "Fine Dining Experience",
      "Artisanal Food Crafting",
      "Gourmet Recipe Development",
      "Professional Chef Preparation",
      "Fresh Market Ingredients",
      "Culinary Art Presentation",
      "Gourmet Food Innovation",
      "Artisanal Cooking Technique",
      "Professional Food Photography",
      "Culinary Excellence Display"
    ],
    people: [
      "Natural Portrait Photography",
      "Authentic Human Connection",
      "Professional Portrait Session",
      "Lifestyle Photography Moment",
      "Human Emotion Capture",
      "Natural Expression Photography",
      "Professional Headshot Session",
      "Lifestyle Portrait Art",
      "Human Story Documentation",
      "Natural Beauty Photography",
      "Professional Portrait Art",
      "Authentic Moment Capture",
      "Human Connection Photography",
      "Natural Expression Art",
      "Professional Portrait Style",
      "Lifestyle Photography Art",
      "Human Emotion Photography",
      "Natural Beauty Portrait"
    ],
    travel: [
      "Breathtaking Mountain Landscape",
      "Scenic Travel Destination",
      "Cultural Heritage Site",
      "Adventure Travel Experience",
      "Natural Wonder Photography",
      "Historic Travel Location",
      "Scenic Landscape Beauty",
      "Cultural Travel Adventure",
      "Natural Destination Photography",
      "Travel Experience Documentation",
      "Scenic View Photography",
      "Cultural Heritage Photography",
      "Adventure Travel Story",
      "Natural Landscape Art",
      "Travel Destination Beauty",
      "Cultural Experience Photography",
      "Scenic Travel Photography",
      "Natural Wonder Experience"
    ],
    abstract: [
      "Abstract Geometric Composition",
      "Colorful Abstract Art",
      "Modern Abstract Design",
      "Creative Abstract Expression",
      "Geometric Art Pattern",
      "Abstract Color Field",
      "Modern Art Composition",
      "Creative Abstract Form",
      "Geometric Abstract Design",
      "Colorful Art Expression",
      "Abstract Pattern Design",
      "Modern Geometric Art",
      "Creative Color Composition",
      "Abstract Art Innovation",
      "Geometric Pattern Art",
      "Colorful Abstract Design",
      "Modern Art Expression",
      "Creative Geometric Form"
    ],
    nature: [
      "Majestic Forest Landscape",
      "Serene Natural Environment",
      "Wildlife Photography Art",
      "Natural Landscape Beauty",
      "Forest Scenic Photography",
      "Natural Wonder Capture",
      "Wildlife Nature Photography",
      "Forest Landscape Art",
      "Natural Environment Beauty",
      "Wildlife Photography Moment",
      "Forest Scenic View",
      "Natural Landscape Art",
      "Wildlife Nature Art",
      "Forest Photography Beauty",
      "Natural Environment Art",
      "Wildlife Photography Art",
      "Forest Landscape Photography",
      "Natural Beauty Photography"
    ],
    technology: [
      "Modern Smartphone Design",
      "Futuristic Computer Setup",
      "Advanced Technology Innovation",
      "Digital Device Showcase",
      "Smart Technology Integration",
      "Modern Tech Product",
      "Innovative Device Design",
      "Advanced Technology Solution",
      "Smart Device Innovation",
      "Modern Technology Display",
      "Digital Innovation Showcase",
      "Smart Technology Product",
      "Advanced Device Design",
      "Modern Tech Innovation",
      "Digital Technology Art",
      "Smart Device Showcase",
      "Innovative Technology Design",
      "Modern Digital Solution"
    ],
    science: [
      "Scientific Research Laboratory",
      "Medical Science Innovation",
      "Advanced Research Technology",
      "Scientific Discovery Process",
      "Laboratory Equipment Showcase",
      "Medical Research Innovation",
      "Scientific Technology Development",
      "Research Laboratory Environment",
      "Medical Science Technology",
      "Scientific Innovation Process",
      "Laboratory Research Equipment",
      "Medical Technology Innovation",
      "Scientific Research Environment",
      "Advanced Laboratory Technology",
      "Medical Science Research",
      "Scientific Innovation Laboratory",
      "Research Technology Development",
      "Medical Laboratory Innovation"
    ],
    healthcare: [
      "Modern Healthcare Facility",
      "Medical Technology Innovation",
      "Healthcare Professional Environment",
      "Medical Equipment Showcase",
      "Healthcare Innovation Center",
      "Modern Medical Facility",
      "Healthcare Technology Solution",
      "Medical Professional Environment",
      "Healthcare Innovation Design",
      "Modern Medical Technology",
      "Healthcare Facility Innovation",
      "Medical Technology Showcase",
      "Healthcare Professional Space",
      "Modern Medical Innovation",
      "Healthcare Technology Development",
      "Medical Facility Design",
      "Healthcare Innovation Technology",
      "Modern Medical Environment"
    ],
    music: [
      "Vintage Vinyl Record Player",
      "Acoustic Guitar Performance",
      "Concert Stage Lighting",
      "Professional Recording Studio",
      "Musical Instrument Art",
      "Live Music Performance",
      "Music Studio Environment",
      "Vintage Music Equipment",
      "Musical Creativity Space",
      "Professional Music Production",
      "Concert Performance Art",
      "Music Studio Technology",
      "Vintage Audio Equipment",
      "Musical Performance Photography",
      "Professional Music Studio",
      "Concert Stage Art",
      "Music Equipment Showcase",
      "Musical Performance Environment"
    ]
  };

  const templates = titleTemplates[category] || ["Professional Photography"];
  return templates[promptIndex % templates.length];
};

// Generate image using Azure OpenAI
async function generateImage(category, prompt, title) {
  try {
    const response = await fetch('http://localhost:3000/api/azure-ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        category: category,
        title: title,
        quality: 'landscape', // Use landscape preset for 1792x1024
        tags: ['gpt-image-1', 'azure', 'natural', 'realistic', category]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error generating image for ${category}:`, error.message);
    return null;
  }
}

// Save image to database
async function saveImage(imageData, category, title, prompt) {
  try {
    const response = await fetch('http://localhost:3000/api/ai/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: imageData,
        category: category,
        title: title,
        description: prompt,
        tags: ['gpt-image-1', 'azure', 'natural', 'realistic', category]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error saving image for ${category}:`, error.message);
    return null;
  }
}

// Download image and convert to base64
async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('❌ Error downloading image:', error.message);
    return null;
  }
}

// Main generation function
async function generateImagesForCategory(categoryInfo) {
  const { name: category, target, current } = categoryInfo;
  const imagesNeeded = target - current;
  
  console.log(`\n🎨 Generating ${imagesNeeded} images for ${category} category...`);
  console.log(`📊 Current: ${current} images, Target: ${target} images`);
  
  const prompts = categoryPrompts[category] || categoryPrompts.abstract;
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < imagesNeeded; i++) {
    const promptIndex = i % prompts.length;
    const prompt = prompts[promptIndex];
    const title = generateUniqueTitle(category, promptIndex);
    
    console.log(`\n🔄 Generating image ${i + 1}/${imagesNeeded} for ${category}...`);
    console.log(`📝 Title: ${title}`);
    
    // Generate image
    const generationResult = await generateImage(category, prompt, title);
    
    if (!generationResult || !generationResult.success) {
      console.log(`❌ Failed to generate image ${i + 1} for ${category}`);
      failCount++;
      continue;
    }
    
    console.log(`✅ Generated image ${i + 1} for ${category}`);
    
    // Download image as base64
    const base64Image = await downloadImageAsBase64(generationResult.imageUrl);
    
    if (!base64Image) {
      console.log(`❌ Failed to download image ${i + 1} for ${category}`);
      failCount++;
      continue;
    }
    
    // Save to database
    const saveResult = await saveImage(base64Image, category, title, prompt);
    
    if (!saveResult || !saveResult.success) {
      console.log(`❌ Failed to save image ${i + 1} for ${category}`);
      failCount++;
      continue;
    }
    
    console.log(`💾 Saved image ${i + 1} for ${category} to database`);
    successCount++;
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📈 ${category} category completed:`);
  console.log(`✅ Successfully generated: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  
  return { success: successCount, failed: failCount };
}

// Main execution
async function main() {
  console.log('🚀 Starting image generation for categories with few images...\n');
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  for (const categoryInfo of categoriesToGenerate) {
    const result = await generateImagesForCategory(categoryInfo);
    totalSuccess += result.success;
    totalFailed += result.failed;
    
    // Add delay between categories
    console.log('\n⏳ Waiting 5 seconds before next category...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n🎉 Image generation completed!');
  console.log(`📊 Total Results:`);
  console.log(`✅ Successfully generated: ${totalSuccess} images`);
  console.log(`❌ Failed: ${totalFailed} images`);
  
  // Calculate estimated cost
  const estimatedCost = totalSuccess * 0.04; // $0.04 per image for DALL-E 3
  console.log(`💰 Estimated cost: $${estimatedCost.toFixed(2)}`);
}

// Run the script
main().catch(console.error);
