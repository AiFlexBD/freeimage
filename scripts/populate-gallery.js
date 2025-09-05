const categories = [
  {
    id: 'nature',
    name: 'Nature',
    prompts: [
      { prompt: 'A stunning mountain landscape at golden hour with snow-capped peaks', title: 'Majestic Mountain Peak at Sunrise' },
      { prompt: 'A peaceful forest path with sunlight filtering through tall trees', title: 'Peaceful Forest Path with Sunlight' },
      { prompt: 'A beautiful waterfall cascading into a crystal clear lake', title: 'Cascading Waterfall in Paradise' },
      { prompt: 'A field of colorful wildflowers under a blue sky with white clouds', title: 'Colorful Wildflower Meadow' },
      { prompt: 'A serene beach at sunset with gentle waves and seashells', title: 'Serene Beach at Golden Hour' }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    prompts: [
      { prompt: 'A modern office workspace with a laptop and coffee cup', title: 'Modern Office Workspace Setup' },
      { prompt: 'A professional business meeting in a glass conference room', title: 'Professional Business Meeting' },
      { prompt: 'A sleek corporate building with glass facade against blue sky', title: 'Corporate Building Architecture' },
      { prompt: 'A handshake between business partners in suits', title: 'Business Handshake Partnership' },
      { prompt: 'A minimalist desk setup with charts and graphs on screen', title: 'Financial Charts and Analytics' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    prompts: [
      { prompt: 'A futuristic smartphone with holographic display', title: 'Futuristic Smartphone Interface' },
      { prompt: 'A modern data center with servers and blue LED lights', title: 'Modern Data Center Servers' },
      { prompt: 'A robot hand touching a human hand with digital effects', title: 'AI and Human Hand Connection' },
      { prompt: 'A laptop displaying code with multiple monitors setup', title: 'Developer Coding Setup' },
      { prompt: 'A sleek electric car charging at a modern station', title: 'Electric Car Charging Station' }
    ]
  },
  {
    id: 'people',
    name: 'People',
    prompts: [
      { prompt: 'A diverse group of friends laughing together in a cafe', title: 'Diverse Friends Laughing Together' },
      { prompt: 'A professional portrait of a confident business woman', title: 'Professional Business Portrait' },
      { prompt: 'A family having a picnic in a sunny park', title: 'Happy Family Picnic Scene' },
      { prompt: 'A chef cooking in a modern kitchen with steam rising', title: 'Chef Cooking in Modern Kitchen' },
      { prompt: 'A student studying with books and laptop in a library', title: 'Student Studying with Books' }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    prompts: [
      { prompt: 'A gourmet burger with fresh ingredients and crispy fries', title: 'Gourmet Burger with Fresh Ingredients' },
      { prompt: 'A colorful fruit salad with berries and tropical fruits', title: 'Colorful Tropical Fruit Salad' },
      { prompt: 'A steaming cup of coffee with latte art and croissant', title: 'Artisan Coffee with Latte Art' },
      { prompt: 'A fresh sushi platter with salmon, tuna and avocado', title: 'Fresh Sushi Platter with Salmon' },
      { prompt: 'A homemade pizza with melted cheese and fresh basil', title: 'Homemade Pizza with Melted Cheese' }
    ]
  },
  {
    id: 'abstract',
    name: 'Abstract',
    prompts: [
      { prompt: 'Flowing liquid colors in blue and purple gradients', title: 'Flowing Liquid Blue and Purple' },
      { prompt: 'Geometric shapes with neon lights and shadows', title: 'Geometric Neon Light Patterns' },
      { prompt: 'Swirling energy patterns with golden particles', title: 'Swirling Golden Energy Particles' },
      { prompt: 'Crystalline structures with rainbow reflections', title: 'Crystalline Rainbow Reflections' },
      { prompt: 'Minimalist composition with bold colors and clean lines', title: 'Minimalist Bold Color Composition' }
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    prompts: [
      { prompt: 'The Eiffel Tower at night with sparkling lights', title: 'Eiffel Tower Sparkling at Night' },
      { prompt: 'A tropical beach with palm trees and turquoise water', title: 'Tropical Paradise Beach Resort' },
      { prompt: 'A bustling street market in Tokyo with neon signs', title: 'Tokyo Street Market Neon Lights' },
      { prompt: 'Ancient ruins of Machu Picchu with misty mountains', title: 'Ancient Machu Picchu Ruins' },
      { prompt: 'A cozy European cafe with outdoor seating and flowers', title: 'European Cafe with Outdoor Seating' }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    prompts: [
      { prompt: 'A cozy reading nook with books, plants and warm lighting', title: 'Cozy Reading Nook with Plants' },
      { prompt: 'A yoga session at sunrise on a peaceful beach', title: 'Sunrise Yoga on Beach' },
      { prompt: 'A modern kitchen with fresh ingredients for cooking', title: 'Modern Kitchen Cooking Setup' },
      { prompt: 'A stylish bedroom with minimalist decor and natural light', title: 'Minimalist Bedroom Design' },
      { prompt: 'A home office setup with plants and inspirational artwork', title: 'Home Office with Natural Light' }
    ]
  }
];

async function generateAndSaveImage(promptData, categoryId) {
  try {
    console.log(`Generating: ${promptData.title}`);
    
    // Generate image using AI API
    const generateResponse = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptData.prompt,
        aspectRatio: '16:9',
        quality: 'high',
        count: 1
      })
    });
    
    if (!generateResponse.ok) {
      throw new Error(`Generation failed: ${generateResponse.status}`);
    }
    
    const generateData = await generateResponse.json();
    
    if (!generateData.images || generateData.images.length === 0) {
      throw new Error('No images generated');
    }
    
    const imageData = generateData.images[0];
    
    // Save image to gallery
    const saveResponse = await fetch('http://localhost:3000/api/ai/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData,
        prompt: promptData.prompt,
        categoryId,
        title: promptData.title,
        description: `Beautiful ${categoryId} image: ${promptData.title.toLowerCase()}`
      })
    });
    
    if (!saveResponse.ok) {
      throw new Error(`Save failed: ${saveResponse.status}`);
    }
    
    const saveData = await saveResponse.json();
    console.log(`✅ Saved: ${promptData.title} -> ${saveData.image.download_url}`);
    
    return saveData.image;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${promptData.title}:`, error.message);
    return null;
  }
}

async function populateGallery() {
  console.log('🎨 Starting gallery population...\n');
  
  let totalGenerated = 0;
  let totalFailed = 0;
  
  for (const category of categories) {
    console.log(`\n📁 Processing category: ${category.name}`);
    
    for (let i = 0; i < category.prompts.length; i++) {
      const promptData = category.prompts[i];
      
      const result = await generateAndSaveImage(promptData, category.id);
      
      if (result) {
        totalGenerated++;
      } else {
        totalFailed++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n🎉 Gallery population complete!`);
  console.log(`✅ Generated: ${totalGenerated} images`);
  console.log(`❌ Failed: ${totalFailed} images`);
  console.log(`📊 Total categories: ${categories.length}`);
}

// Run the script
populateGallery().catch(console.error); 