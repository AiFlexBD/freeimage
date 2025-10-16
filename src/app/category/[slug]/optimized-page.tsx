'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import OptimizedImageCard from '@/components/OptimizedImageCard'

// Category-specific content functions
function getCategoryDescription(categoryName: string): string {
  const descriptions: Record<string, string> = {
    'Oil Painted': 'Our oil painted images capture the timeless beauty and rich textures of traditional oil painting techniques. Each image is carefully crafted to evoke the depth, warmth, and artistic mastery that makes oil paintings so captivating.',
    'Anime': 'Discover stunning anime-style artwork featuring vibrant characters, dynamic scenes, and the distinctive artistic style that anime fans love. Perfect for gaming, manga, and Japanese-inspired designs.',
    'Space': 'Explore the cosmos with our collection of space and galaxy images. From nebulas and star clusters to planets and cosmic phenomena, these images bring the universe to your creative projects.',
    'Pixel Art': 'Retro gaming meets modern design with our pixel art collection. These carefully crafted images capture the nostalgic charm of 8-bit and 16-bit graphics while maintaining crisp, modern quality.',
    'Aesthetic': 'Minimalist, clean, and visually striking aesthetic images perfect for modern design projects. These images focus on simplicity, balance, and visual harmony.',
    'Lofi Music': 'Chill vibes and cozy atmospheres define our lofi music background collection. Perfect for creating relaxing, study-friendly, or ambient design environments.',
    'Product': 'Professional product photography and close-up shots perfect for e-commerce, marketing, and commercial use. High-quality images that showcase products in their best light.',
    'Nature': 'Breathtaking landscapes, wildlife, and natural scenes that bring the beauty of the outdoors to your projects.',
    'Business': 'Professional business imagery including office environments, corporate settings, and business-related concepts.',
    'Abstract': 'Bold, creative abstract art that adds visual interest and artistic flair to any project.',
    'Food': 'Mouth-watering food photography perfect for restaurants, blogs, and culinary content.',
    'Technology': 'Modern tech imagery including devices, interfaces, and digital concepts.',
    'Lifestyle': 'Authentic lifestyle photography capturing real moments and experiences.',
    'Architecture': 'Stunning architectural photography showcasing buildings, interiors, and design.',
    'Travel': 'Beautiful travel photography from destinations around the world.',
    'Fashion': 'Stylish fashion photography and clothing imagery.',
    'Sports': 'Dynamic sports photography capturing action and athleticism.',
    'Animals': 'Adorable and majestic animal photography.',
    'Flowers': 'Beautiful floral photography and botanical imagery.',
    'Vintage': 'Classic vintage-style photography with timeless appeal.',
    'Minimalist': 'Clean, simple minimalist photography focusing on essential elements.',
    'Dark': 'Moody, dramatic dark photography with rich tones.',
    'Bright': 'Vibrant, energetic bright photography with high contrast.',
    'Gradient': 'Beautiful gradient backgrounds and colorful transitions.',
    'Pattern': 'Intricate patterns and textures for design projects.',
    'Medieval': 'Historical medieval imagery with castles, knights, and fantasy elements.',
    'Music': 'Music-themed imagery including instruments, concerts, and musical concepts.'
  }
  
  return descriptions[categoryName] || `Explore our collection of ${categoryName.toLowerCase()} images. High-quality AI-generated content perfect for your creative projects.`
}

function getCategoryFeatures(categoryName: string): string[] {
  const features: Record<string, string[]> = {
    'Oil Painted': ['Rich textures and depth', 'Traditional painting techniques', 'Warm color palettes', 'Artistic brushstrokes'],
    'Anime': ['Vibrant characters', 'Dynamic compositions', 'Japanese art style', 'Gaming aesthetics'],
    'Space': ['Cosmic phenomena', 'Galaxy formations', 'Planetary views', 'Nebula clouds'],
    'Pixel Art': ['Retro gaming style', '8-bit aesthetics', 'Crisp pixel details', 'Nostalgic charm'],
    'Aesthetic': ['Minimalist design', 'Clean compositions', 'Visual harmony', 'Modern appeal'],
    'Lofi Music': ['Chill atmospheres', 'Cozy vibes', 'Relaxing tones', 'Study-friendly'],
    'Product': ['Professional quality', 'Clean backgrounds', 'High resolution', 'Commercial ready'],
    'Nature': ['Natural beauty', 'Outdoor scenes', 'Wildlife photography', 'Landscape views'],
    'Business': ['Professional settings', 'Corporate environments', 'Business concepts', 'Office scenes'],
    'Abstract': ['Creative compositions', 'Bold colors', 'Artistic expression', 'Unique perspectives'],
    'Food': ['Appetizing presentation', 'Fresh ingredients', 'Culinary artistry', 'Restaurant quality'],
    'Technology': ['Modern devices', 'Digital interfaces', 'Tech concepts', 'Innovation themes'],
    'Lifestyle': ['Authentic moments', 'Real experiences', 'Human connections', 'Everyday scenes'],
    'Architecture': ['Building designs', 'Interior spaces', 'Structural beauty', 'Design elements'],
    'Travel': ['Destination views', 'Cultural scenes', 'Adventure themes', 'World locations'],
    'Fashion': ['Stylish clothing', 'Trendy designs', 'Fashion photography', 'Style concepts'],
    'Sports': ['Athletic action', 'Dynamic movements', 'Competition scenes', 'Team sports'],
    'Animals': ['Wildlife photography', 'Pet portraits', 'Animal behavior', 'Nature scenes'],
    'Flowers': ['Botanical beauty', 'Floral arrangements', 'Garden scenes', 'Plant photography'],
    'Vintage': ['Classic styles', 'Retro aesthetics', 'Timeless appeal', 'Historical themes'],
    'Minimalist': ['Simple compositions', 'Clean lines', 'Essential elements', 'Reduced complexity'],
    'Dark': ['Moody atmospheres', 'Dramatic lighting', 'Rich tones', 'Mysterious vibes'],
    'Bright': ['Vibrant colors', 'High contrast', 'Energetic feel', 'Positive vibes'],
    'Gradient': ['Color transitions', 'Smooth blends', 'Background designs', 'Visual effects'],
    'Pattern': ['Repeating designs', 'Textural elements', 'Geometric shapes', 'Decorative motifs'],
    'Medieval': ['Historical themes', 'Fantasy elements', 'Castle scenes', 'Knight imagery'],
    'Music': ['Musical instruments', 'Concert scenes', 'Sound waves', 'Audio concepts']
  }
  
  return features[categoryName] || ['High quality', 'AI generated', 'Commercial use', 'Free download']
}

function getCategoryUseCases(categoryName: string): string[] {
  const useCases: Record<string, string[]> = {
    'Oil Painted': ['Art galleries', 'Museum displays', 'Artistic projects', 'Creative portfolios'],
    'Anime': ['Gaming content', 'Manga illustrations', 'Anime projects', 'Character design'],
    'Space': ['Science presentations', 'Educational content', 'Space exploration', 'Astronomy projects'],
    'Pixel Art': ['Game development', 'Retro designs', '8-bit projects', 'Nostalgic content'],
    'Aesthetic': ['Modern websites', 'Minimalist designs', 'Clean layouts', 'Contemporary projects'],
    'Lofi Music': ['Study playlists', 'Relaxation content', 'Ambient videos', 'Chill streams'],
    'Product': ['E-commerce sites', 'Marketing materials', 'Product catalogs', 'Commercial ads'],
    'Nature': ['Travel blogs', 'Outdoor content', 'Environmental projects', 'Nature documentaries'],
    'Business': ['Corporate websites', 'Business presentations', 'Professional content', 'Company materials'],
    'Abstract': ['Artistic projects', 'Creative designs', 'Modern art', 'Experimental content'],
    'Food': ['Restaurant websites', 'Food blogs', 'Culinary content', 'Recipe sites'],
    'Technology': ['Tech blogs', 'Software interfaces', 'Digital products', 'Innovation content'],
    'Lifestyle': ['Social media', 'Blog content', 'Personal projects', 'Lifestyle brands'],
    'Architecture': ['Real estate', 'Design portfolios', 'Architectural content', 'Building projects'],
    'Travel': ['Travel blogs', 'Tourism content', 'Adventure stories', 'Destination guides'],
    'Fashion': ['Fashion blogs', 'Style content', 'Clothing brands', 'Fashion magazines'],
    'Sports': ['Sports content', 'Athletic brands', 'Fitness projects', 'Sports journalism'],
    'Animals': ['Pet blogs', 'Wildlife content', 'Animal welfare', 'Nature documentaries'],
    'Flowers': ['Garden blogs', 'Floral arrangements', 'Botanical content', 'Wedding projects'],
    'Vintage': ['Retro projects', 'Historical content', 'Classic designs', 'Nostalgic themes'],
    'Minimalist': ['Clean designs', 'Simple layouts', 'Modern websites', 'Minimalist brands'],
    'Dark': ['Moody content', 'Dramatic presentations', 'Artistic projects', 'Gothic themes'],
    'Bright': ['Energetic content', 'Positive messaging', 'Vibrant designs', 'Uplifting projects'],
    'Gradient': ['Background designs', 'UI elements', 'Visual effects', 'Color transitions'],
    'Pattern': ['Textile design', 'Wallpaper patterns', 'Decorative elements', 'Surface designs'],
    'Medieval': ['Fantasy games', 'Historical content', 'RPG projects', 'Medieval themes'],
    'Music': ['Music blogs', 'Concert content', 'Audio projects', 'Musical brands']
  }
  
  return useCases[categoryName] || ['Web design', 'Marketing', 'Social media', 'Creative projects']
}

function getCategoryTips(categoryName: string): string[] {
  const tips: Record<string, string[]> = {
    'Oil Painted': ['Use warm lighting to enhance textures', 'Consider vintage color palettes', 'Perfect for artistic projects', 'Great for gallery displays'],
    'Anime': ['Vibrant colors work best', 'Consider character-focused compositions', 'Perfect for gaming content', 'Great for manga-style projects'],
    'Space': ['Use dark backgrounds for contrast', 'Consider cosmic color schemes', 'Perfect for science content', 'Great for educational materials'],
    'Pixel Art': ['Maintain crisp pixel edges', 'Use limited color palettes', 'Perfect for retro projects', 'Great for game development'],
    'Aesthetic': ['Keep compositions simple', 'Use clean, modern layouts', 'Perfect for minimalist designs', 'Great for contemporary projects'],
    'Lofi Music': ['Use warm, muted tones', 'Consider cozy atmospheres', 'Perfect for relaxation content', 'Great for study environments'],
    'Product': ['Ensure clean backgrounds', 'Use professional lighting', 'Perfect for e-commerce', 'Great for marketing materials'],
    'Nature': ['Capture natural lighting', 'Consider seasonal themes', 'Perfect for outdoor content', 'Great for environmental projects'],
    'Business': ['Use professional settings', 'Consider corporate color schemes', 'Perfect for business content', 'Great for professional presentations'],
    'Abstract': ['Experiment with compositions', 'Use bold color combinations', 'Perfect for artistic projects', 'Great for creative designs'],
    'Food': ['Use natural lighting', 'Consider appetizing presentations', 'Perfect for culinary content', 'Great for restaurant marketing'],
    'Technology': ['Use modern, clean designs', 'Consider futuristic elements', 'Perfect for tech content', 'Great for digital products'],
    'Lifestyle': ['Capture authentic moments', 'Use natural, candid shots', 'Perfect for social media', 'Great for personal brands'],
    'Architecture': ['Consider different angles', 'Use natural lighting', 'Perfect for real estate', 'Great for design portfolios'],
    'Travel': ['Capture local culture', 'Use vibrant, inviting colors', 'Perfect for tourism content', 'Great for travel blogs'],
    'Fashion': ['Use stylish compositions', 'Consider current trends', 'Perfect for fashion content', 'Great for style blogs'],
    'Sports': ['Capture dynamic action', 'Use energetic compositions', 'Perfect for athletic content', 'Great for sports marketing'],
    'Animals': ['Capture natural behavior', 'Use soft, natural lighting', 'Perfect for wildlife content', 'Great for pet projects'],
    'Flowers': ['Use natural lighting', 'Consider seasonal varieties', 'Perfect for botanical content', 'Great for garden projects'],
    'Vintage': ['Use classic color palettes', 'Consider historical elements', 'Perfect for retro projects', 'Great for nostalgic content'],
    'Minimalist': ['Keep designs simple', 'Use plenty of white space', 'Perfect for clean layouts', 'Great for modern projects'],
    'Dark': ['Use dramatic lighting', 'Consider moody atmospheres', 'Perfect for artistic content', 'Great for dramatic presentations'],
    'Bright': ['Use vibrant colors', 'Consider energetic compositions', 'Perfect for positive content', 'Great for uplifting projects'],
    'Gradient': ['Use smooth color transitions', 'Consider multiple color stops', 'Perfect for backgrounds', 'Great for visual effects'],
    'Pattern': ['Ensure repeating elements', 'Consider scale and proportion', 'Perfect for textiles', 'Great for surface designs'],
    'Medieval': ['Use historical color palettes', 'Consider fantasy elements', 'Perfect for RPG content', 'Great for historical projects'],
    'Music': ['Use musical elements', 'Consider sound wave patterns', 'Perfect for audio content', 'Great for music projects']
  }
  
  return tips[categoryName] || ['Choose high-quality images', 'Consider your target audience', 'Use appropriate sizing', 'Maintain consistent style']
}

interface DatabaseImage {
  id: string
  title: string
  description?: string
  download_url: string
  thumbnail_url?: string
  category_id: string
  downloads: number
  tags?: string[]
  created_at: string
  categories?: {
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageCount: number
}

export default function OptimizedCategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [images, setImages] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Memoize category data to prevent unnecessary re-renders
  const categoryData = useMemo(() => {
    if (!category) return null
    
    return {
      description: getCategoryDescription(category.name),
      features: getCategoryFeatures(category.name),
      useCases: getCategoryUseCases(category.name),
      tips: getCategoryTips(category.name)
    }
  }, [category])

  const fetchCategory = useCallback(async () => {
    try {
      // First try static categories
      const staticCategory = categories.find(cat => cat.slug === params.slug)
      if (staticCategory) {
        setCategory({
          id: staticCategory.id,
          name: staticCategory.name,
          slug: staticCategory.slug,
          description: staticCategory.description,
          imageCount: 0 // Will be updated when we fetch images
        })
        return
      }

      // If not found in static, fetch from API
      const response = await fetch(`/api/categories?slug=${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.category) {
          setCategory(data.category)
        } else {
          setError('Category not found')
        }
      } else {
        setError('Failed to load category')
      }
    } catch (err) {
      console.error('Error fetching category:', err)
      setError('Failed to load category')
    }
  }, [params.slug])

  const fetchImages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!category) return
    
    try {
      if (append) {
        setLoadingMore(true)
      }
      
      const response = await fetch(`/api/images?category=${category.id}&page=${pageNum}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.images) {
          if (append) {
            setImages(prev => [...prev, ...data.images])
          } else {
            setImages(data.images)
          }
          setHasMore(data.images.length === 20)
        }
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      if (append) {
        setLoadingMore(false)
      }
    }
  }, [category])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchImages(nextPage, true)
    }
  }, [page, fetchImages, loadingMore, hasMore])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCategory(),
        fetchImages(1, false)
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchCategory, fetchImages])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/categories" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {category.name} Images
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {categoryData?.description}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>{images.length}+ Images</span>
              <span>•</span>
              <span>Free Download</span>
              <span>•</span>
              <span>Commercial Use</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <OptimizedImageCard
                  key={image.id}
                  image={image}
                  priority={index < 8} // Prioritize first 8 images
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Images'
                  )}
                </button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && images.length > 0 && (
              <div className="text-center mt-12 py-8">
                <p className="text-gray-500">You've reached the end of the {category.name} collection!</p>
                <Link 
                  href="/categories" 
                  className="mt-4 inline-block px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Browse Other Categories
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Category Info */}
              {categoryData && (
                <>
                  {/* Features */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {categoryData.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Use Cases */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfect For</h3>
                    <ul className="space-y-2">
                      {categoryData.useCases.map((useCase, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Design Tips */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Tips</h3>
                    <ul className="space-y-2">
                      {categoryData.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Related Categories */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Categories</h3>
                <div className="space-y-3">
                  {categories
                    .filter(cat => cat.id !== category.id)
                    .slice(0, 5)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{cat.name}</span>
                        <span className="text-sm text-gray-500">{cat.imageCount}+</span>
                      </Link>
                    ))}
                </div>
                <div className="mt-4">
                  <Link
                    href="/categories"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
