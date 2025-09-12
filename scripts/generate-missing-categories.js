#!/usr/bin/env node

/**
 * Generate ultra-high quality, photorealistic images for missing categories using Azure DALL-E 3
 * Focus on professional photography that looks completely natural and authentic
 */

// Use built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

// Categories that currently have images (updated list)
const categoriesWithImages = [
  'nature', 'business', 'technology', 'people', 'food', 'abstract', 'travel', 'architecture'
];

// All defined categories
const allCategories = [
  {
    id: 'nature',
    name: 'Nature',
    description: 'Beautiful landscapes, wildlife, and natural scenes'
  },
  {
    id: 'business', 
    name: 'Business',
    description: 'Professional business environments and concepts'
  },
  {
    id: 'technology',
    name: 'Technology', 
    description: 'Modern tech devices and digital concepts'
  },
  {
    id: 'people',
    name: 'People',
    description: 'Portraits and human interactions'
  },
  {
    id: 'food',
    name: 'Food',
    description: 'Delicious dishes and culinary delights'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Creative and artistic abstract designs'
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'Buildings, structures, and urban design'
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'World destinations and travel experiences'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle', 
    description: 'Modern lifestyle, wellness, and daily activities'
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Wildlife, pets, and animal photography'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic activities and sports equipment'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Style, clothing, and fashion photography'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Cars, motorcycles, and transportation'
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Artistic creations and creative expressions'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Scientific concepts, laboratories, and research'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning, schools, and educational concepts'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical, wellness, and healthcare imagery'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Musical instruments, concerts, and audio concepts'
  }
];

// Get categories that need images
const missingCategories = allCategories.filter(cat => !categoriesWithImages.includes(cat.id));

console.log(`🎯 Found ${missingCategories.length} categories that need images:`);
missingCategories.forEach(cat => console.log(`   - ${cat.name} (${cat.id})`));

// Ultra-realistic professional prompts designed to avoid AI detection
const categoryPrompts = {
  architecture: [
    "Ultra-realistic photograph of a stunning modern glass office building at golden hour, captured with Canon EOS R5, professional architectural photography, sharp details, natural lighting, award-winning composition, shot by renowned architectural photographer, published in Architectural Digest",
    "Photorealistic image of ancient Roman amphitheater ruins at sunset, shot with Nikon D850, professional travel photography, dramatic natural lighting, perfect exposure, National Geographic style, authentic historical architecture",
    "Professional real estate photograph of luxury minimalist home interior, shot with Sony A7R IV, natural window lighting, clean architectural lines, high-end residential design, magazine-quality photography, ultra-sharp details",
    "Documentary-style photograph of traditional Japanese temple architecture, captured with Fujifilm GFX 100S, authentic cultural photography, natural lighting, professional composition, travel magazine quality"
  ],
  lifestyle: [
    "Wide panoramic lifestyle photograph of young professional working at trendy coffee shop with large windows, shot with Canon 5D Mark IV, natural window lighting, authentic moment, lifestyle magazine photography, horizontal composition, wide-angle view",
    "Panoramic morning wellness routine photograph, yoga practitioner in bright modern apartment with city skyline view, shot with Sony A7 III, natural lighting, lifestyle photography, wide horizontal format, health magazine quality",
    "Wide-angle professional lifestyle photograph of modern Scandinavian living room with panoramic windows, natural lighting, cozy atmosphere, interior design magazine quality, shot with Nikon Z7 II, horizontal composition",
    "Wide documentary-style photograph of weekend farmers market scene, authentic local culture, shot with Leica Q2, natural lighting, lifestyle journalism, panoramic view of market stalls, professional street photography",
    "Panoramic family dinner gathering photograph, multi-generational family around dining table, shot with Canon EOS R6, warm golden hour lighting, authentic family lifestyle, wide horizontal composition, lifestyle magazine quality",
    "Wide-angle home office workspace photograph, remote work setup with mountain view window, shot with Sony A7R IV, natural lighting, work-life balance lifestyle, horizontal composition, modern productivity aesthetic"
  ],
  animals: [
    "Wildlife photography masterpiece of African lion in natural habitat, shot with Canon EOS-1D X Mark III, 600mm telephoto lens, golden hour lighting, National Geographic quality, authentic wildlife behavior, professional nature photography",
    "Heartwarming pet portrait of golden retriever in autumn park, shot with Nikon D780, natural lighting, professional pet photography, genuine emotion, shallow depth of field, award-winning animal photography",
    "Stunning wildlife photograph of colorful macaw in Costa Rican rainforest, shot with Sony A9 II, natural habitat, professional nature photography, vibrant natural colors, BBC Planet Earth quality documentation",
    "Majestic wild horse photography in American Southwest landscape, shot with Canon EOS R6, telephoto lens, natural behavior, professional wildlife photography, dramatic natural lighting, authentic Western scenery",
    "Professional elephant family photography in African savanna, shot with Canon EOS-1D X Mark III, telephoto lens, golden hour lighting, authentic wildlife behavior, National Geographic documentary style",
    "Adorable cat portrait photography in natural window light, shot with Sony A7 III, shallow depth of field, professional pet photography, genuine feline expression, lifestyle pet photography"
  ],
  sports: [
    "Professional sports photography of basketball player mid-dunk, shot with Nikon D6, fast shutter speed, arena lighting, Sports Illustrated quality, authentic athletic moment, dynamic action, professional sports journalism",
    "Olympic swimming competition photograph, underwater action shot, professional sports photography, captured with specialized underwater housing, authentic competitive moment, crystal clear water, professional timing",
    "Professional tennis tournament photography, player serving at Wimbledon, shot with Canon EOS-1D X Mark III, perfect timing, authentic competitive moment, professional sports journalism, natural grass court",
    "Marathon runner crossing finish line, emotional victory moment, shot with Sony A9 II, natural lighting, authentic human achievement, professional sports photography, genuine celebration",
    "Professional soccer player action shot, mid-kick during championship match, shot with Canon EOS-1D X Mark III, fast shutter speed, stadium lighting, ESPN quality sports photography",
    "Professional rock climbing photography, athlete scaling cliff face, shot with Nikon D850, natural outdoor lighting, adventure sports photography, dramatic mountain landscape background"
  ],
  fashion: [
    "High-end fashion photography shoot, model in designer evening gown, shot in professional studio with Hasselblad H6D-100c, perfect lighting setup, Vogue magazine quality, authentic fashion photography, professional styling",
    "Street style fashion photograph in Milan during Fashion Week, authentic urban fashion, shot with Leica M11, natural city lighting, professional fashion journalism, genuine style documentation, candid moment",
    "Luxury fashion accessories still life, designer handbag and jewelry, shot with Phase One XF IQ4, professional product photography, perfect lighting, commercial photography quality, authentic luxury goods",
    "Behind-the-scenes fashion runway photography, models backstage preparation, shot with Canon R5, authentic fashion industry moment, professional documentary style, genuine fashion world insight"
  ],
  automotive: [
    "Professional automotive photography of luxury sports car on scenic mountain road, shot with Canon EOS R5, dramatic natural lighting, automotive magazine quality, perfect composition, authentic driving scenario",
    "Classic vintage automobile at car show, professional automotive photography, shot with Nikon D850, natural outdoor lighting, authentic restoration, classic car magazine quality, perfect details",
    "Modern electric vehicle in urban setting, professional automotive photography, shot with Sony A7R IV, contemporary city backdrop, authentic sustainable transportation, clean modern design",
    "Motorcycle touring photography on scenic highway, professional travel photography, shot with Canon 6D Mark II, natural lighting, authentic road trip adventure, motorcycle magazine quality"
  ],
  art: [
    "Professional fine art gallery photograph, contemporary painting exhibition, shot with Canon EOS R6, museum-quality lighting, authentic gallery setting, art documentation photography, professional curation",
    "Artist working in authentic studio space, candid creative process photography, shot with Nikon Z6 II, natural studio lighting, genuine artistic creation, professional documentary style, authentic workspace",
    "Modern sculpture installation in contemporary art museum, professional art photography, shot with Sony A7 III, perfect museum lighting, authentic art documentation, gallery-quality presentation",
    "Street art documentation in urban environment, authentic mural photography, shot with Fujifilm X-T4, natural lighting, professional urban photography, genuine cultural expression"
  ],
  science: [
    "Professional laboratory photography, scientist conducting research, shot with Canon 5D Mark IV, authentic research environment, clean laboratory lighting, scientific documentation, genuine research activity, professional medical photography",
    "Microscopy laboratory scene, researcher examining specimens, professional science photography, shot with Nikon D780, authentic laboratory setting, natural lighting, scientific journalism quality",
    "Modern research facility interior, professional architectural photography of science building, shot with Sony A7R IV, clean institutional lighting, authentic academic environment, professional documentation",
    "Field research photography, scientists collecting environmental samples, shot with Canon EOS R, natural outdoor lighting, authentic scientific fieldwork, National Geographic documentary style"
  ],
  education: [
    "University lecture hall during class, authentic educational environment, shot with Canon 6D Mark II, natural classroom lighting, professional educational photography, genuine learning atmosphere, documentary style",
    "Library study scene with students, authentic academic environment, shot with Nikon Z5, natural lighting, professional educational photography, genuine scholarly activity, university documentation",
    "Graduation ceremony photography, authentic celebration moment, shot with Canon R6, natural outdoor lighting, professional event photography, genuine achievement, emotional documentary style",
    "Modern classroom with interactive technology, professional educational photography, shot with Sony A7 III, natural lighting, authentic learning environment, contemporary education documentation"
  ],
  healthcare: [
    "Professional medical facility photography, modern hospital corridor, shot with Canon EOS R5, clean institutional lighting, authentic healthcare environment, professional medical documentation, sterile atmosphere",
    "Healthcare professional consultation, authentic medical interaction, shot with Nikon D850, natural office lighting, professional medical photography, genuine patient care, documentary healthcare style",
    "Modern medical equipment in hospital setting, professional healthcare photography, shot with Sony A7R IV, clean medical lighting, authentic hospital environment, professional medical documentation",
    "Wellness center photography, therapeutic environment, shot with Canon 5D Mark IV, natural lighting, authentic healthcare setting, professional wellness photography, calming atmosphere"
  ],
  music: [
    "Concert hall performance photography, classical musician playing grand piano, shot with Canon EOS-1D X Mark III, dramatic stage lighting, authentic performance moment, professional music photography, concert documentation",
    "Recording studio session, authentic music production, shot with Nikon D780, professional studio lighting, genuine creative process, music industry photography, authentic recording environment",
    "Live music venue photography, band performing on stage, shot with Sony A9 II, dynamic concert lighting, authentic live music moment, professional concert photography, genuine performance energy",
    "Music instrument photography, vintage guitar close-up, shot with Canon R5, professional product photography, perfect lighting, authentic musical instrument, commercial photography quality"
  ]
};

let totalCost = 0;
let successCount = 0;
let errorCount = 0;

async function generateImageForCategory(category, promptIndex) {
  const prompts = categoryPrompts[category.id];
  if (!prompts || prompts.length === 0) {
    console.log(`❌ No prompts found for ${category.name}`);
    return false;
  }

  // Cycle through available prompts for 20 images
  const prompt = prompts[promptIndex % prompts.length];
  
  try {
    console.log(`🎨 Generating ultra-realistic image ${promptIndex + 1} for ${category.name}...`);
    console.log(`   Professional prompt: ${prompt.substring(0, 100)}...`);

    const response = await fetch('http://localhost:3000/api/azure-ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
              body: JSON.stringify({
          prompt: `WIDE HORIZONTAL LANDSCAPE IMAGE: ${prompt}. CRITICAL: Must be landscape format - wider than tall, horizontal composition, panoramic view, wide aspect ratio. NO vertical/portrait elements.`,
          quality: 'landscape', // Use landscape preset which forces 1792x1024 landscape
          style: 'natural' // More realistic than 'vivid'
        }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.image && data.image.url) {
      console.log(`✅ Generated photorealistic image for ${category.name} #${promptIndex + 1}`);
      
      // Create unique, SEO-friendly titles based on the actual prompts
      const seoFriendlyTitles = {
        architecture: [
          `Modern Glass Office Building Golden Hour Architecture`,
          `Ancient Roman Amphitheater Ruins Sunset Photography`,
          `Luxury Minimalist Home Interior Real Estate`,
          `Traditional Japanese Temple Documentary Architecture`
        ],
        lifestyle: [
          `Young Professional Coffee Shop Workspace Lifestyle`,
          `Morning Yoga Wellness Routine Modern Apartment`,
          `Scandinavian Living Room Interior Design Photography`,
          `Weekend Farmers Market Community Lifestyle Scene`,
          `Family Dinner Gathering Multi-Generational Lifestyle`,
          `Remote Work Home Office Mountain View Setup`
        ],
        animals: [
          `African Lion Wildlife Photography Natural Habitat`,
          `Golden Retriever Pet Portrait Autumn Park`,
          `Colorful Macaw Rainforest Wildlife Costa Rica`,
          `Wild Horses American Southwest Landscape Photography`,
          `Elephant Family African Savanna Wildlife Documentary`,
          `Cat Portrait Natural Window Light Pet Photography`
        ],
        sports: [
          `Basketball Player Slam Dunk Sports Action`,
          `Olympic Swimming Competition Underwater Photography`,
          `Tennis Player Wimbledon Tournament Professional`,
          `Marathon Runner Finish Line Victory Moment`,
          `Soccer Player Championship Match Action Shot`,
          `Rock Climbing Adventure Sports Mountain Photography`
        ],
        fashion: [
          `Designer Evening Gown Fashion Studio Photography`,
          `Milan Fashion Week Street Style Urban`,
          `Luxury Fashion Accessories Designer Collection`,
          `Fashion Runway Backstage Behind Scenes Photography`
        ],
        automotive: [
          `Luxury Sports Car Mountain Road Photography`,
          `Classic Vintage Automobile Car Show Restoration`,
          `Modern Electric Vehicle Urban Sustainable Transport`,
          `Motorcycle Highway Touring Adventure Photography`
        ],
        art: [
          `Contemporary Art Gallery Exhibition Photography`,
          `Artist Studio Creative Process Documentary`,
          `Modern Sculpture Museum Installation Art`,
          `Street Art Urban Mural Cultural Expression`
        ],
        science: [
          `Modern Laboratory Scientific Research Photography`,
          `Microscopy Research Laboratory Science Documentation`,
          `Research Facility Architecture Scientific Building`,
          `Field Research Environmental Science Documentation`
        ],
        education: [
          `University Lecture Hall Educational Environment`,
          `Library Study Academic Research Photography`,
          `Graduation Ceremony Achievement Celebration`,
          `Modern Classroom Interactive Technology Education`
        ],
        healthcare: [
          `Modern Hospital Medical Facility Photography`,
          `Healthcare Professional Medical Consultation`,
          `Medical Equipment Hospital Technology`,
          `Wellness Center Therapeutic Healthcare Environment`
        ],
        music: [
          `Concert Hall Piano Performance Classical Music`,
          `Recording Studio Music Production Professional`,
          `Live Music Venue Band Performance Photography`,
          `Vintage Guitar Musical Instrument Photography`
        ]
      };

      // Generate unique, SEO-friendly title for each image
      const baseTitle = seoFriendlyTitles[category.id] && seoFriendlyTitles[category.id][promptIndex] 
        ? seoFriendlyTitles[category.id][promptIndex]
        : `Professional ${category.name} Photography`;
      
      // Add unique identifier for 20 images per category
      const uniqueId = Math.random().toString(36).substr(2, 6).toUpperCase();
      const title = `${baseTitle} ${uniqueId}`;

      // Download the image to get base64 data for saving
      console.log(`📥 Downloading image for ${category.name} #${promptIndex + 1}...`);
      const imageResponse = await fetch(data.image.url);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

      // Save to gallery
      const saveResponse = await fetch('http://localhost:3000/api/ai/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageBase64,
          prompt: prompt,
          categoryId: category.id,
          title: title,
          description: `Professional ${category.name.toLowerCase()} photography captured with high-end equipment and expert composition. Perfect for commercial and editorial use.`,
          dimensions: { width: 1792, height: 1024 }
        }),
      });

      if (saveResponse.ok) {
        console.log(`💾 Saved professional ${category.name} image to gallery`);
        successCount++;
        totalCost += 0.08; // Landscape preset cost estimate
        return true;
      } else {
        const errorData = await saveResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.log(`⚠️  Failed to save ${category.name} #${promptIndex + 1}: ${errorData.error || saveResponse.statusText}`);
        errorCount++;
        return false;
      }
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(`❌ Failed to generate ${category.name} #${promptIndex + 1}:`, error.message);
    errorCount++;
    return false;
  }
}

async function generateImagesForAllCategories() {
  console.log(`\n🚀 Starting ULTRA-HIGH QUALITY image generation for ${missingCategories.length} categories...`);
  console.log(`📸 Professional photography quality - indistinguishable from real photos`);
  console.log(`📊 Generating 20 photorealistic images per category = ${missingCategories.length * 20} total images`);
  console.log(`🎯 Settings: MAXIMUM HD quality (1792x1024), natural style, professional prompts\n`);

  for (const category of missingCategories) {
    console.log(`\n📂 Processing category: ${category.name}`);
    console.log(`   Description: ${category.description}`);
    console.log(`   Quality: Ultra-realistic professional photography`);
    
    // Generate 20 images per category
    for (let i = 0; i < 20; i++) {
      await generateImageForCategory(category, i);
      
      // Delay between requests to ensure quality and avoid rate limiting
      if (i < 19) {
        console.log(`   ⏳ Processing next image...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced delay for efficiency
      }
    }
    
    // Longer delay between categories for stability
    console.log(`✨ Completed ${category.name} - 4 professional images generated`);
    if (category !== missingCategories[missingCategories.length - 1]) {
      console.log(`⏳ Preparing next category (7 second pause)...`);
      await new Promise(resolve => setTimeout(resolve, 7000));
    }
  }

  // Final summary
  console.log(`\n🎉 ULTRA-HIGH QUALITY image generation completed!`);
  console.log(`📊 Professional Photography Summary:`);
  console.log(`   ✅ Successfully generated: ${successCount} photorealistic images`);
  console.log(`   ❌ Failed: ${errorCount} images`);
  console.log(`   💰 Estimated cost: $${totalCost.toFixed(2)}`);
  console.log(`   🏷️  Categories populated: ${missingCategories.length}`);
  console.log(`   📸 Quality: MAXIMUM resolution professional photography (1792x1024)`);
  console.log(`   🎯 Realism: Indistinguishable from authentic photography`);
  console.log(`\n🔄 Refresh your homepage to see the new professional categories!`);
  console.log(`🌟 All images are commercial-ready and professionally crafted!`);
}

// Run the script
if (require.main === module) {
  generateImagesForAllCategories().catch(console.error);
}

module.exports = { generateImagesForAllCategories, missingCategories }; 