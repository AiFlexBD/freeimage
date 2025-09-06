#!/usr/bin/env node

const categories = [
  // Existing categories
  {
    id: 'nature',
    prompts: [
      'Breathtaking mountain landscape at sunrise with misty valleys, 8K resolution, cinematic lighting',
      'Crystal clear lake reflection with autumn trees, ultra-high detail, professional photography',
      'Majestic waterfall cascading through lush green forest, dramatic lighting, 4K quality',
      'Golden sunset over rolling hills with wildflowers, photorealistic, stunning colors',
      'Ancient redwood forest with sunbeams filtering through fog, ethereal atmosphere'
    ]
  },
  {
    id: 'business',
    prompts: [
      'Modern corporate office space with glass walls and city view, professional lighting, 4K',
      'Business team collaboration in sleek conference room, high-end photography style',
      'Executive handshake in contemporary office setting, crisp detail, professional quality',
      'Digital transformation concept with holographic displays, futuristic business environment',
      'Startup workspace with creative professionals, modern design, natural lighting'
    ]
  },
  {
    id: 'technology',
    prompts: [
      'Cutting-edge data center with glowing servers, cyberpunk aesthetic, ultra-high resolution',
      'AI robot hand reaching towards human hand, futuristic lighting, 8K detail',
      'Quantum computer in pristine laboratory, sci-fi atmosphere, professional photography',
      'Holographic interface floating in modern tech lab, neon lighting, cinematic quality',
      'Advanced smartphone with transparent display, product photography, studio lighting'
    ]
  },
  {
    id: 'people',
    prompts: [
      'Professional portrait of confident business leader, studio lighting, magazine quality',
      'Diverse team of young professionals celebrating success, natural expressions, 4K',
      'Artist creating masterpiece in sunlit studio, authentic moment, high detail',
      'Multi-generational family portrait with warm lighting, emotional connection',
      'Creative entrepreneur working in modern coworking space, lifestyle photography'
    ]
  },
  {
    id: 'food',
    prompts: [
      'Gourmet restaurant dish with artistic plating, professional food photography, 4K',
      'Fresh organic vegetables arranged beautifully, natural lighting, ultra-detailed',
      'Artisanal coffee with latte art in ceramic cup, warm atmosphere, high resolution',
      'Colorful farmers market produce display, vibrant colors, photojournalism style',
      'Chef preparing exquisite meal in professional kitchen, action shot, dramatic lighting'
    ]
  },
  {
    id: 'abstract',
    prompts: [
      'Fluid liquid metal abstract composition, iridescent colors, 8K resolution',
      'Geometric crystal formations with rainbow light refraction, ultra-detailed',
      'Swirling galaxy-like patterns in deep space colors, cosmic abstract art',
      'Minimalist architectural abstract with clean lines, modern design aesthetic',
      'Organic flowing shapes in pastel gradients, dreamy abstract composition'
    ]
  },
  {
    id: 'architecture',
    prompts: [
      'Stunning modern skyscraper with glass facade, urban photography, golden hour lighting',
      'Historic cathedral interior with dramatic lighting, architectural photography, 4K',
      'Contemporary residential home with clean lines, architectural digest style',
      'Futuristic city skyline with innovative buildings, sci-fi architecture, ultra-detailed',
      'Minimalist concrete structure with geometric shadows, brutalist architecture'
    ]
  },
  {
    id: 'travel',
    prompts: [
      'Tropical paradise beach with crystal clear water, travel photography, 8K resolution',
      'Ancient temple complex at sunset, cultural heritage, dramatic lighting',
      'European cobblestone street with historic buildings, charming atmosphere',
      'Mountain village perched on cliff overlooking ocean, breathtaking vista',
      'Desert oasis with palm trees and clear blue water, exotic destination'
    ]
  },
  // New categories
  {
    id: 'lifestyle',
    prompts: [
      'Modern yoga session in minimalist studio, wellness lifestyle, natural lighting, 4K',
      'Cozy reading nook with plants and natural light, hygge aesthetic, high detail',
      'Healthy breakfast spread with fresh ingredients, lifestyle photography, vibrant colors',
      'Morning routine in stylish bedroom, lifestyle magazine quality, soft lighting',
      'Meditation space with candles and plants, peaceful atmosphere, zen aesthetics'
    ]
  },
  {
    id: 'animals',
    prompts: [
      'Majestic lion portrait in golden savanna light, wildlife photography, 8K detail',
      'Playful dolphins jumping in crystal clear ocean, marine life, dynamic action',
      'Colorful tropical birds in rainforest canopy, nature photography, vivid colors',
      'Gentle elephant family in African wilderness, emotional wildlife moment, 4K',
      'Arctic fox in snowy landscape, winter wildlife, pristine white environment'
    ]
  },
  {
    id: 'sports',
    prompts: [
      'Professional athlete in action during sunset training, sports photography, dynamic',
      'Olympic swimmer diving into pool, underwater perspective, high-speed capture, 4K',
      'Mountain climber scaling dramatic cliff face, adventure sports, breathtaking view',
      'Basketball player making incredible dunk, arena lighting, sports action, ultra-detailed',
      'Surfer riding massive wave, ocean sports, golden hour lighting, epic scale'
    ]
  },
  {
    id: 'fashion',
    prompts: [
      'High fashion model in avant-garde outfit, studio lighting, magazine editorial style, 4K',
      'Luxury accessories arranged artistically, product photography, premium quality',
      'Street fashion photography in urban setting, contemporary style, natural lighting',
      'Elegant evening gown in dramatic lighting, fashion photography, sophisticated',
      'Designer shoes collection display, luxury retail, perfect lighting, ultra-detailed'
    ]
  },
  {
    id: 'automotive',
    prompts: [
      'Luxury sports car on mountain road at sunset, automotive photography, 8K resolution',
      'Classic vintage car in urban setting, nostalgic atmosphere, professional quality',
      'Electric vehicle charging in futuristic city, sustainable transport, modern design',
      'Motorcycle on scenic coastal highway, adventure travel, dramatic lighting',
      'Car interior with premium leather and technology, luxury automotive, detailed craftsmanship'
    ]
  },
  {
    id: 'art',
    prompts: [
      'Artist studio with colorful paintings and creative chaos, artistic atmosphere, 4K',
      'Abstract sculpture in modern gallery space, contemporary art, dramatic lighting',
      'Street art mural on urban wall, vibrant colors, cultural expression, high detail',
      'Traditional pottery being shaped on wheel, artisan craft, natural lighting',
      'Digital art creation process on tablet, modern creativity, tech meets art'
    ]
  },
  {
    id: 'science',
    prompts: [
      'Advanced laboratory with scientists conducting research, scientific precision, 4K',
      'Microscopic view of cellular structures, scientific photography, ultra-detailed',
      'Space telescope capturing distant galaxies, astronomy, cosmic scale, 8K',
      'DNA double helix visualization, biotechnology, scientific illustration, high resolution',
      'Chemistry experiment with colorful reactions, laboratory setting, dynamic colors'
    ]
  },
  {
    id: 'education',
    prompts: [
      'Modern classroom with interactive technology, educational environment, bright lighting',
      'University library with students studying, academic atmosphere, natural light, 4K',
      'Science laboratory with students conducting experiments, educational setting',
      'Online learning setup with multiple screens, digital education, contemporary',
      'Graduation ceremony with caps thrown in air, celebration moment, joyful atmosphere'
    ]
  },
  {
    id: 'healthcare',
    prompts: [
      'Modern hospital room with advanced medical equipment, healthcare technology, clean design',
      'Doctor consulting with patient, compassionate healthcare, professional environment',
      'Surgical team in operating room, medical precision, sterile environment, 4K',
      'Wellness spa treatment room, holistic health, calming atmosphere, natural lighting',
      'Medical research laboratory, pharmaceutical development, scientific precision'
    ]
  },
  {
    id: 'music',
    prompts: [
      'Concert hall with orchestra performing, classical music, dramatic stage lighting, 4K',
      'Recording studio with professional equipment, music production, atmospheric lighting',
      'Street musician performing in urban square, authentic moment, natural lighting',
      'DJ performing at electronic music festival, dynamic lights, energetic atmosphere',
      'Vintage vinyl records and turntable, music nostalgia, warm lighting, detailed'
    ]
  }
]

async function generateImagesForCategory(category) {
  console.log(`\n🎨 Generating images for ${category.id.toUpperCase()} category...`)
  
  for (let i = 0; i < category.prompts.length; i++) {
    const prompt = category.prompts[i]
    console.log(`  📸 Generating image ${i + 1}/5: ${prompt.substring(0, 50)}...`)
    
    try {
      // Generate image with maximum quality
      const generateResponse = await fetch('http://localhost:3000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: '16:9',
          quality: 'max', // Maximum quality for high resolution
          count: 1
        })
      })
      
      if (!generateResponse.ok) {
        throw new Error(`Generation failed: ${generateResponse.status}`)
      }
      
      const generateData = await generateResponse.json()
      
      if (generateData.success && generateData.images && generateData.images.length > 0) {
        const imageData = generateData.images[0]
        
        // Create meaningful title
        const title = `${category.id.charAt(0).toUpperCase() + category.id.slice(1)} - ${prompt.split(',')[0].trim()}`
        
        // Save to gallery
        const saveResponse = await fetch('http://localhost:3000/api/ai/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: imageData.data,
            title: title,
            description: prompt,
            category: category.id,
            tags: [category.id, 'AI generated', 'high resolution', '4K', 'professional'],
            quality: 'max',
            dimensions: generateData.dimensions
          })
        })
        
        if (saveResponse.ok) {
          const saveData = await saveResponse.json()
          console.log(`    ✅ Saved: ${saveData.title}`)
          
          // Display cost information if available
          if (generateData.costs) {
            console.log(`    💰 Cost: $${generateData.costs.totalCost.toFixed(4)}`)
          }
        } else {
          console.log(`    ❌ Failed to save image`)
        }
      } else {
        console.log(`    ❌ No image generated`)
      }
      
      // Wait between generations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error(`    ❌ Error generating image: ${error.message}`)
    }
  }
}

async function main() {
  console.log('🚀 Starting comprehensive image generation for all categories...')
  console.log(`📊 Total categories: ${categories.length}`)
  console.log(`🖼️  Total images to generate: ${categories.length * 5}`)
  
  let totalCost = 0
  
  for (const category of categories) {
    await generateImagesForCategory(category)
  }
  
  console.log('\n🎉 Image generation completed!')
  console.log('🔗 Visit http://localhost:3000 to see your new high-resolution images!')
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
}) 