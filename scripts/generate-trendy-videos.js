#!/usr/bin/env node

// Trendy Video Generator using Azure OpenAI Sora Model
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Video categories and prompts
const videoCategories = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    prompts: [
      "A trendy young person walking through a bustling city street at golden hour, wearing stylish streetwear, with smooth camera movement following them",
      "Beautiful sunset timelapse over a modern city skyline with clouds moving dramatically across the frame",
      "A cozy coffee shop scene with steam rising from a latte, people working on laptops, and warm ambient lighting",
      "A person doing yoga on a rooftop with the city in the background, slow graceful movements in natural light",
      "Aerial drone footage of a beach at sunset with waves gently lapping the shore and people walking along the water"
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    prompts: [
      "A model walking down a runway in a flowing dress with dramatic lighting and slow-motion movement",
      "Close-up of hands applying makeup with smooth, precise movements and professional lighting",
      "A fashion shoot in an urban setting with a model posing against graffiti walls, dynamic camera angles",
      "Timelapse of a stylist preparing a model for a photoshoot, quick cuts showing the transformation",
      "A person trying on different outfits in front of a mirror, with smooth transitions between looks"
    ]
  },
  {
    id: 'food',
    name: 'Food',
    prompts: [
      "Close-up of a chef's hands preparing sushi with precise, artistic movements and fresh ingredients",
      "A steaming bowl of ramen with chopsticks picking up noodles, slow-motion capture of the steam",
      "A bartender creating a cocktail with liquid mixing and ice swirling in slow motion",
      "Fresh vegetables being chopped on a wooden cutting board with natural lighting and crisp sounds",
      "A pizza being pulled from a wood-fired oven with cheese stretching and steam rising"
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    prompts: [
      "Aerial footage of a tropical island with crystal clear water and palm trees swaying in the breeze",
      "A train journey through mountain landscapes with changing scenery and golden hour lighting",
      "A person walking through a bustling market in an exotic location with vibrant colors and movement",
      "Timelapse of clouds moving over a mountain range with dramatic lighting changes",
      "A drone shot following a winding road through a forest with autumn colors"
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    prompts: [
      "Close-up of fingers typing on a mechanical keyboard with RGB lighting and smooth focus pulls",
      "A futuristic cityscape with flying cars and holographic displays, smooth camera movement",
      "A person using VR headset with glowing interface elements and immersive lighting effects",
      "Timelapse of a 3D printer creating an object layer by layer with precise mechanical movements",
      "A smartphone screen showing app transitions with smooth animations and modern UI design"
    ]
  }
];

// Unique titles for each video
const videoTitles = {
  lifestyle: [
    "Urban Street Walk",
    "City Sunset Timelapse", 
    "Coffee Shop Ambiance",
    "Rooftop Yoga Flow",
    "Beach Drone Sunset"
  ],
  fashion: [
    "Runway Model Walk",
    "Makeup Artistry Hands",
    "Urban Fashion Shoot",
    "Stylist Transformation",
    "Mirror Outfit Changes"
  ],
  food: [
    "Sushi Chef Precision",
    "Ramen Steam Slowmo",
    "Cocktail Mixing Art",
    "Vegetable Chopping Fresh",
    "Pizza Oven Stretch"
  ],
  travel: [
    "Tropical Island Aerial",
    "Mountain Train Journey",
    "Exotic Market Walk",
    "Mountain Cloud Timelapse",
    "Forest Road Drone"
  ],
  technology: [
    "Keyboard RGB Typing",
    "Futuristic City Flight",
    "VR Interface Glow",
    "3D Printer Layers",
    "Smartphone UI Flow"
  ]
};

let totalGenerated = 0;
let totalCost = 0;

// Generate video with Azure OpenAI Sora
async function generateWithSora(prompt, category, index) {
  try {
    console.log(`🎬 Generating video: ${prompt.substring(0, 60)}...`);
    
    const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/sora-video-1/video/generations?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'sora-video-1',
        prompt: prompt,
        duration: 10, // 10 seconds
        aspect_ratio: '16:9',
        quality: 'hd'
      })
    });

    if (!response.ok) {
      throw new Error(`Sora API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.video_url) {
      // Download the video
      const videoResponse = await fetch(data.video_url);
      const videoBuffer = await videoResponse.arrayBuffer();
      const videoBase64 = `data:video/mp4;base64,${Buffer.from(videoBuffer).toString('base64')}`;

      // Generate unique title
      const title = videoTitles[category][index] || `Trendy Video ${index + 1}`;
      
      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Save to database
      const saveResponse = await fetch('http://localhost:3000/api/videos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData: videoBase64,
          prompt: prompt,
          categoryId: category,
          title: title,
          description: prompt,
          duration: 10,
          tags: ['sora-video', 'azure', 'trendy', 'hd', category],
          slug: slug
        }),
      });

      if (saveResponse.ok) {
        totalGenerated++;
        totalCost += 0.10; // Estimated Sora pricing
        console.log(`✅ Saved: ${title}`);
        return true;
      } else {
        console.log(`❌ Save failed: ${title}`);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.log(`❌ Sora error: ${error.message}`);
    return false;
  }
}

// Generate videos for a category
async function generateForCategory(categoryId, categoryName, prompts) {
  console.log(`\n🎬 Generating ${prompts.length} trendy videos for ${categoryName}...`);
  
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    console.log(`   ${i + 1}/${prompts.length}: ${prompt.substring(0, 60)}...`);
    
    await generateWithSora(prompt, categoryId, i);
    
    // Delay between generations
    if (i < prompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log(`✨ Completed ${categoryName} - ${prompts.length} new trendy videos`);
}

// Main execution
async function generateAllTrendyVideos() {
  console.log('🎬 Starting Trendy Video Generation with Azure OpenAI Sora');
  console.log(`📊 Generating ${videoCategories.length} categories with trendy videos`);
  console.log('🎯 Focus: High-quality, trendy videos for modern content\n');

  for (let i = 0; i < videoCategories.length; i++) {
    const category = videoCategories[i];
    await generateForCategory(category.id, category.name, category.prompts);
    
    // Pause between categories
    if (i < videoCategories.length - 1) {
      console.log('⏳ Category break (10 seconds)...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  console.log('\n🎉 TRENDY VIDEO GENERATION COMPLETE!');
  console.log(`📈 Total generated: ${totalGenerated} trendy videos`);
  console.log(`💰 Estimated cost: $${totalCost.toFixed(2)}`);
  console.log('🏷️  All videos tagged with AI source (Sora-Video)');
  console.log('✨ Each video has unique, trendy title');
}

// Run the generator
generateAllTrendyVideos().catch(console.error);
