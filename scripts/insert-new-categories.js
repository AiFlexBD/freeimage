#!/usr/bin/env node

const newCategories = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Modern lifestyle, wellness, and daily activities',
    image_count: 0,
    featured_image: '/images/lifestyle/featured.jpg',
    sort_order: 9
  },
  {
    id: 'animals',
    name: 'Animals',
    slug: 'animals',
    description: 'Wildlife, pets, and animal photography',
    image_count: 0,
    featured_image: '/images/animals/featured.jpg',
    sort_order: 10
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Athletic activities and sports equipment',
    image_count: 0,
    featured_image: '/images/sports/featured.jpg',
    sort_order: 11
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Style, clothing, and fashion photography',
    image_count: 0,
    featured_image: '/images/fashion/featured.jpg',
    sort_order: 12
  },
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Cars, motorcycles, and transportation',
    image_count: 0,
    featured_image: '/images/automotive/featured.jpg',
    sort_order: 13
  },
  {
    id: 'art',
    name: 'Art',
    slug: 'art',
    description: 'Artistic creations and creative expressions',
    image_count: 0,
    featured_image: '/images/art/featured.jpg',
    sort_order: 14
  },
  {
    id: 'science',
    name: 'Science',
    slug: 'science',
    description: 'Scientific concepts, laboratories, and research',
    image_count: 0,
    featured_image: '/images/science/featured.jpg',
    sort_order: 15
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    description: 'Learning, schools, and educational concepts',
    image_count: 0,
    featured_image: '/images/education/featured.jpg',
    sort_order: 16
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'Medical, wellness, and healthcare imagery',
    image_count: 0,
    featured_image: '/images/healthcare/featured.jpg',
    sort_order: 17
  },
  {
    id: 'music',
    name: 'Music',
    slug: 'music',
    description: 'Musical instruments, concerts, and audio concepts',
    image_count: 0,
    featured_image: '/images/music/featured.jpg',
    sort_order: 18
  }
]

async function insertNewCategories() {
  console.log('🗄️  Inserting new categories into database...')
  
  try {
    // Use the admin API to insert categories
    const response = await fetch('http://localhost:3000/api/categories/bulk-insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: newCategories })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Categories inserted successfully!')
      console.log(`📂 Inserted: ${newCategories.map(c => c.name).join(', ')}`)
      return true
    } else {
      // If bulk insert API doesn't exist, we'll create a simple SQL insert
      console.log('⚠️  Bulk insert API not available, using direct database approach...')
      
      // Create SQL INSERT statement
      const sqlValues = newCategories.map(cat => 
        `('${cat.id}', '${cat.name}', '${cat.slug}', '${cat.description}', ${cat.image_count}, '${cat.featured_image}', ${cat.sort_order})`
      ).join(',\n  ')
      
      const sqlStatement = `
INSERT INTO categories (id, name, slug, description, image_count, featured_image, sort_order) VALUES
  ${sqlValues}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;`
      
      console.log('\n📝 SQL Statement to run in your database:')
      console.log('=' .repeat(80))
      console.log(sqlStatement)
      console.log('=' .repeat(80))
      console.log('\n💡 Please run this SQL in your Supabase dashboard or psql client')
      return false
    }
  } catch (error) {
    console.error('❌ Error inserting categories:', error.message)
    
    // Fallback: show SQL statement
    const sqlValues = newCategories.map(cat => 
      `('${cat.id}', '${cat.name}', '${cat.slug}', '${cat.description}', ${cat.image_count}, '${cat.featured_image}', ${cat.sort_order})`
    ).join(',\n  ')
    
    const sqlStatement = `
INSERT INTO categories (id, name, slug, description, image_count, featured_image, sort_order) VALUES
  ${sqlValues}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;`
    
    console.log('\n📝 SQL Statement to run manually:')
    console.log('=' .repeat(80))
    console.log(sqlStatement)
    console.log('=' .repeat(80))
    return false
  }
}

async function main() {
  console.log('🚀 Setting up new categories in database...')
  console.log(`📂 Categories to add: ${newCategories.length}`)
  
  const success = await insertNewCategories()
  
  if (success) {
    console.log('\n🎉 Categories setup completed!')
    console.log('✅ Ready to generate images for new categories')
    console.log('🔗 Run: node scripts/generate-new-categories.js')
  } else {
    console.log('\n⚠️  Manual database setup required')
    console.log('1. Copy the SQL statement above')
    console.log('2. Run it in your Supabase SQL editor')
    console.log('3. Then run: node scripts/generate-new-categories.js')
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
}) 