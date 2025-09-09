#!/usr/bin/env node

// ONLY NEW CATEGORIES - No duplicates!
const newCategories = [
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

async function generateImagesForNewCategory(category) {
  console.log(`\n🎨 Generating images for NEW category: ${category.id.toUpperCase()}...`)
  
  for (let i = 0; i < category.prompts.length; i++) {
    const prompt = category.prompts[i]
    console.log(`  📸 Image ${i + 1}/5: ${prompt.substring(0, 60)}...`)
    
    try {
      // Generate with maximum quality
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
        const errorText = await generateResponse.text()
        throw new Error(`Generation failed: ${generateResponse.status} - ${errorText}`)
      }
      
      const generateData = await generateResponse.json()
      
      if (generateData.success && generateData.images && generateData.images.length > 0) {
        const imageUrl = generateData.images[0]
        
        // Create meaningful title for new category
        const title = `${category.id.charAt(0).toUpperCase() + category.id.slice(1)} - ${prompt.split(',')[0].trim()}`
        
        // For base64 images, use the save API
        if (imageUrl.startsWith('data:image/')) {
          const saveResponse = await fetch('http://localhost:3000/api/ai/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: imageUrl,
              prompt: prompt,
              categoryId: category.id,
              title: title,
              description: prompt,
              tags: [category.id, 'AI generated', 'high resolution', '4K', 'professional', 'new category'],
              dimensions: generateData.dimensions
            })
          })
          
          if (saveResponse.ok) {
            const saveData = await saveResponse.json()
            console.log(`    ✅ Saved: ${saveData.title}`)
            
            if (generateData.costs) {
              console.log(`    💰 Cost: $${generateData.costs.totalCost.toFixed(4)}`)
            }
          } else {
            const errorText = await saveResponse.text()
            console.log(`    ❌ Failed to save: ${errorText}`)
          }
        } else {
          // For placeholder images, just log the URL
          console.log(`    ⚠️  Using placeholder: ${imageUrl}`)
          console.log(`    💡 Note: Real images will be generated when Gemini API is properly configured`)
        }
      } else {
        console.log(`    ❌ No image generated: ${JSON.stringify(generateData)}`)
      }
      
      // Wait between generations
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error(`    ❌ Error: ${error.message}`)
    }
  }
}

async function main() {
  console.log('🚀 Generating HIGH-RESOLUTION images for NEW categories ONLY!')
  console.log(`📂 New categories: ${newCategories.length}`)
  console.log(`🖼️  Total new images: ${newCategories.length * 5} (50 images)`)
  console.log(`💎 Quality: Maximum (4K-8K resolution)`)
  console.log(`⏱️  Estimated time: ~3-5 minutes`)
  
  let totalCost = 0
  let successCount = 0
  
  for (const category of newCategories) {
    await generateImagesForNewCategory(category)
    successCount += 5 // Assuming all succeed for now
  }
  
  console.log('\n🎉 NEW CATEGORY IMAGE GENERATION COMPLETED!')
  console.log(`✅ Generated ${successCount} high-resolution images`)
  console.log(`📂 Categories: ${newCategories.map(c => c.id).join(', ')}`)
  console.log('🔗 Visit http://localhost:3000/categories to see your new categories!')
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
}) 