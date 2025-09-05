import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Meaningful titles for each category
const meaningfulTitles = {
  food: [
    'Gourmet Burger with Fresh Ingredients',
    'Colorful Tropical Fruit Salad',
    'Artisan Coffee with Latte Art',
    'Fresh Sushi Platter with Salmon',
    'Homemade Pizza with Melted Cheese',
    'Delicious Pasta with Tomato Sauce',
    'Fresh Garden Salad with Vegetables',
    'Chocolate Cake with Berry Topping',
    'Grilled Chicken with Herbs',
    'Fresh Seafood on Ice'
  ],
  nature: [
    'Majestic Mountain Peak at Sunrise',
    'Peaceful Forest Path with Sunlight',
    'Cascading Waterfall in Paradise',
    'Colorful Wildflower Meadow',
    'Serene Beach at Golden Hour',
    'Ancient Oak Tree in Morning Mist',
    'Crystal Clear Lake Reflection',
    'Rolling Hills in Spring',
    'Dramatic Sunset Over Ocean',
    'Snow-Capped Mountain Range'
  ],
  business: [
    'Modern Office Workspace Setup',
    'Professional Business Meeting',
    'Corporate Building Architecture',
    'Business Handshake Partnership',
    'Financial Charts and Analytics',
    'Team Collaboration Session',
    'Executive Conference Room',
    'Business Strategy Planning',
    'Professional Presentation',
    'Corporate Success Concept'
  ],
  technology: [
    'Futuristic Smartphone Interface',
    'Modern Data Center Servers',
    'AI and Human Hand Connection',
    'Developer Coding Setup',
    'Electric Car Charging Station',
    'Cloud Computing Concept',
    'Cybersecurity Digital Shield',
    'Virtual Reality Experience',
    'IoT Connected Devices',
    'Blockchain Technology Network'
  ],
  people: [
    'Diverse Friends Laughing Together',
    'Professional Business Portrait',
    'Happy Family Picnic Scene',
    'Chef Cooking in Modern Kitchen',
    'Student Studying with Books',
    'Elderly Couple Walking Together',
    'Children Playing in Park',
    'Yoga Class in Peaceful Setting',
    'Musicians Performing on Stage',
    'Athletes Training Together'
  ],
  abstract: [
    'Flowing Liquid Blue and Purple',
    'Geometric Neon Light Patterns',
    'Swirling Golden Energy Particles',
    'Crystalline Rainbow Reflections',
    'Minimalist Bold Color Composition',
    'Dynamic Wave Motion Graphics',
    'Cosmic Space Nebula Effect',
    'Digital Pixel Art Pattern',
    'Organic Fluid Art Movement',
    'Gradient Sphere Formations'
  ],
  travel: [
    'Eiffel Tower Sparkling at Night',
    'Tropical Paradise Beach Resort',
    'Tokyo Street Market Neon Lights',
    'Ancient Machu Picchu Ruins',
    'European Cafe with Outdoor Seating',
    'Desert Sand Dunes at Sunset',
    'Mountain Village in Alps',
    'City Skyline at Blue Hour',
    'Historic Castle on Hilltop',
    'Coastal Lighthouse by Ocean'
  ],
  lifestyle: [
    'Cozy Reading Nook with Plants',
    'Sunrise Yoga on Beach',
    'Modern Kitchen Cooking Setup',
    'Minimalist Bedroom Design',
    'Home Office with Natural Light',
    'Spa Relaxation Environment',
    'Fitness Workout at Home',
    'Meditation Garden Space',
    'Artistic Creative Studio',
    'Luxury Bathroom Interior'
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json()

    if (!category || !meaningfulTitles[category as keyof typeof meaningfulTitles]) {
      return NextResponse.json(
        { error: 'Invalid category provided' },
        { status: 400 }
      )
    }

    // Get all images for the category
    const { data: images, error: fetchError } = await supabase
      .from('images')
      .select('id, title, description')
      .eq('category_id', category)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      )
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { message: 'No images found for this category' },
        { status: 404 }
      )
    }

    const titles = meaningfulTitles[category as keyof typeof meaningfulTitles]
    let updatedCount = 0

    // Update each image with a meaningful title
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const newTitle = titles[i % titles.length] // Cycle through titles if more images than titles
      
      // Only update if current title is generic (contains "Food 1", "Nature 2", etc.)
      if (image.title.match(/^(Food|Nature|Business|Technology|People|Abstract|Travel|Lifestyle) \d+$/)) {
        const { error: updateError } = await supabase
          .from('images')
          .update({ 
            title: newTitle,
            description: `Beautiful ${category} image: ${newTitle.toLowerCase()}`
          })
          .eq('id', image.id)

        if (updateError) {
          console.error(`Update error for ${image.id}:`, updateError)
        } else {
          updatedCount++
          console.log(`Updated ${image.id}: ${image.title} -> ${newTitle}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} ${category} image titles`,
      updatedCount,
      totalImages: images.length
    })

  } catch (error) {
    console.error('Update titles error:', error)
    return NextResponse.json(
      { error: 'Failed to update titles' },
      { status: 500 }
    )
  }
} 