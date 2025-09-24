'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import PerformanceImageCard from '@/components/PerformanceImageCard'
import PerformanceImageGallery from '@/components/PerformanceImageGallery'
import FluentLaneAd from '@/components/FluentLaneAd'
import AdSense from '@/components/AdSense'

interface DatabaseImage {
  id: string
  title: string
  category_id: string
  download_url: string
  thumbnail_url?: string
  downloads: number
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

// Memoized components for better performance
const CategoryHeader = memo(({ category, description }: { category: Category, description: string }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {category.name} Images
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
          {description}
        </p>
        <div className="flex items-center justify-center space-x-4 text-blue-100">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{category.imageCount.toLocaleString()} images</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Free download</span>
          </div>
        </div>
      </div>
    </div>
  </div>
))

const CategoryFeatures = memo(({ features }: { features: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((feature, index) => (
      <div key={index} className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-700">{feature}</p>
      </div>
    ))}
  </div>
))

const CategoryUseCases = memo(({ useCases }: { useCases: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {useCases.map((useCase, index) => (
      <div key={index} className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          {useCase.split(':')[0]}
        </h4>
        <p className="text-blue-800 text-sm">
          {useCase.split(':')[1]}
        </p>
      </div>
    ))}
  </div>
))

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
    'Technology': 'Modern tech imagery featuring devices, digital concepts, and futuristic technology themes.',
    'Food': 'Delicious food photography perfect for restaurants, recipes, and culinary content.',
    'Travel': 'Stunning travel destinations and cultural imagery from around the world.',
    'People': 'Diverse human subjects in various settings and activities.',
    'Architecture': 'Beautiful buildings, structures, and architectural details.',
    'Abstract': 'Creative abstract art and non-representational imagery.'
  }
  return descriptions[categoryName] || `Our collection of ${categoryName.toLowerCase()} images offers a diverse range of high-quality, professionally generated visuals perfect for your creative projects.`
}

function getCategoryFeatures(categoryName: string): string[] {
  const features: Record<string, string[]> = {
    'Oil Painted': [
      'Rich, textured brushstrokes and artistic depth',
      'Classic oil painting color palettes and techniques',
      'Timeless artistic appeal and sophistication',
      'High-resolution suitable for large prints',
      'Unique hand-painted aesthetic'
    ],
    'Anime': [
      'Authentic anime art style and character design',
      'Vibrant colors and dynamic compositions',
      'Perfect for gaming and manga projects',
      'High-quality digital artwork',
      'Trendy and popular visual style'
    ],
    'Space': [
      'Stunning cosmic phenomena and celestial bodies',
      'High-resolution space photography quality',
      'Perfect for sci-fi and astronomy projects',
      'Vibrant colors and dramatic lighting',
      'Educational and inspirational content'
    ],
    'Pixel Art': [
      'Authentic retro gaming aesthetics',
      'Crisp, clean pixel-perfect graphics',
      'Nostalgic 8-bit and 16-bit style',
      'Perfect for indie game development',
      'Modern quality with classic charm'
    ],
    'Aesthetic': [
      'Minimalist and clean design principles',
      'Perfect color harmony and balance',
      'Modern and trendy visual appeal',
      'Versatile for various design projects',
      'High-quality and professional look'
    ],
    'Lofi Music': [
      'Cozy and relaxing atmospheres',
      'Perfect for study and work environments',
      'Warm, muted color palettes',
      'Nostalgic and comforting vibes',
      'Great for background and ambient use'
    ],
    'Product': [
      'Professional product photography quality',
      'Clean backgrounds and perfect lighting',
      'High-resolution for detailed viewing',
      'Perfect for e-commerce and marketing',
      'Commercial-ready and versatile'
    ]
  }
  return features[categoryName] || [
    'High-quality AI-generated images',
    'Perfect for commercial use',
    'No attribution required',
    'Multiple formats available',
    'Regular updates and new content'
  ]
}

function getCategoryUseCases(categoryName: string): string[] {
  const useCases: Record<string, string[]> = {
    'Oil Painted': [
      'Art Galleries: Display in physical and digital art exhibitions',
      'Interior Design: Add sophisticated artistic elements to spaces',
      'Marketing: Create premium, high-end brand imagery',
      'Education: Teach art history and painting techniques',
      'Publishing: Illustrate books and magazines with classic art'
    ],
    'Anime': [
      'Gaming: Character design and game assets',
      'Manga: Comic book illustrations and covers',
      'Social Media: Eye-catching posts and stories',
      'Merchandise: T-shirts, posters, and collectibles',
      'Streaming: Twitch overlays and YouTube thumbnails'
    ],
    'Space': [
      'Education: Astronomy and science presentations',
      'Gaming: Sci-fi game backgrounds and environments',
      'Marketing: Technology and innovation campaigns',
      'Publishing: Science books and articles',
      'Entertainment: Movie and TV show backgrounds'
    ],
    'Pixel Art': [
      'Indie Games: Character sprites and game assets',
      'Web Design: Retro-themed websites and apps',
      'Social Media: Nostalgic posts and stories',
      'Merchandise: Retro gaming products',
      'Streaming: Gaming channel overlays'
    ],
    'Aesthetic': [
      'Social Media: Instagram posts and stories',
      'Web Design: Modern, clean website layouts',
      'Marketing: Minimalist brand campaigns',
      'Print Design: Posters and flyers',
      'Mobile Apps: App icons and interfaces'
    ],
    'Lofi Music': [
      'Music Streaming: Album covers and thumbnails',
      'Study Apps: Background images for focus',
      'Social Media: Relaxing content posts',
      'Web Design: Calm, peaceful website themes',
      'Podcasting: Episode artwork and covers'
    ],
    'Product': [
      'E-commerce: Product listings and catalogs',
      'Marketing: Advertising campaigns and brochures',
      'Web Design: Product showcase pages',
      'Social Media: Product promotion posts',
      'Print: Catalogs and product manuals'
    ]
  }
  return useCases[categoryName] || [
    'Web Design: Website backgrounds and headers',
    'Social Media: Posts, stories, and covers',
    'Marketing: Campaigns and advertisements',
    'Print Design: Brochures and flyers',
    'Presentations: Slides and visual aids'
  ]
}

function getCategoryTips(categoryName: string): string[] {
  const tips: Record<string, string[]> = {
    'Oil Painted': [
      'Use warm, rich color palettes to enhance the oil painting effect',
      'Consider the lighting direction to match the brushstroke patterns',
      'Layer multiple images for a gallery wall effect',
      'Use high contrast for dramatic impact',
      'Pair with elegant, sophisticated typography'
    ],
    'Anime': [
      'Use vibrant, saturated colors for authentic anime style',
      'Consider character expressions and dynamic poses',
      'Layer with Japanese text or symbols for authenticity',
      'Use bold, clean typography that matches the style',
      'Consider the target audience and age-appropriateness'
    ],
    'Space': [
      'Use dark backgrounds to make space images pop',
      'Consider the scale and perspective of cosmic objects',
      'Layer with scientific data or constellation lines',
      'Use cool color palettes (blues, purples, whites)',
      'Consider the educational or entertainment purpose'
    ],
    'Pixel Art': [
      'Maintain consistent pixel size and grid alignment',
      'Use limited color palettes for authentic retro feel',
      'Consider the target resolution and display size',
      'Use pixel-perfect scaling to avoid blurriness',
      'Pair with retro fonts and design elements'
    ],
    'Aesthetic': [
      'Focus on negative space and clean composition',
      'Use consistent color palettes and minimal elements',
      'Consider the mood and emotional impact',
      'Use high contrast for visual impact',
      'Keep text minimal and well-spaced'
    ],
    'Lofi Music': [
      'Use warm, muted color palettes',
      'Consider the cozy, intimate atmosphere',
      'Layer with subtle textures and grain',
      'Use soft, rounded design elements',
      'Consider the calming, relaxing mood'
    ],
    'Product': [
      'Use clean, uncluttered backgrounds',
      'Ensure proper lighting and shadows',
      'Consider the product\'s key features and benefits',
      'Use consistent styling across product images',
      'Consider the target market and brand positioning'
    ]
  }
  return tips[categoryName] || [
    'Choose images that match your brand\'s color palette',
    'Consider the emotional impact and mood',
    'Use high-quality images for professional results',
    'Test different layouts and compositions',
    'Consider the target audience and context'
  ]
}

export default function PerformanceCategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [images, setImages] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

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
    try {
      const response = await fetch(`/api/images?category=${params.slug}&page=${pageNum}&limit=20`)
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
    }
  }, [params.slug])

  const loadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchImages(nextPage, true)
  }, [page, fetchImages])

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

  const description = getCategoryDescription(category.name)
  const features = getCategoryFeatures(category.name)
  const useCases = getCategoryUseCases(category.name)
  const tips = getCategoryTips(category.name)

  return (
    <div className="min-h-screen bg-white">
      <CategoryHeader category={category} description={description} />

      {/* FluentLane Ad */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FluentLaneAd variant="banner" />
        </div>
      </section>

      {/* Category Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose {category.name} Images?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our {category.name.toLowerCase()} collection offers unique advantages for your creative projects.
            </p>
          </div>
          <CategoryFeatures features={features} />
        </div>
      </section>

      {/* AdSense */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSense slot="category-middle" />
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how {category.name.toLowerCase()} images can enhance your projects.
            </p>
          </div>
          <CategoryUseCases useCases={useCases} />
        </div>
      </section>

      {/* Design Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Design Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get the most out of your {category.name.toLowerCase()} images with these expert tips.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Images Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {category.name} Images
            </h2>
            <p className="text-xl text-gray-600">
              Browse our collection of {category.imageCount.toLocaleString()} {category.name.toLowerCase()} images.
            </p>
          </div>
          
          <PerformanceImageGallery
            images={images}
            category={category.slug}
            loadMore={loadMore}
            hasMore={hasMore}
            loading={loading}
          />
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Related Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover more image categories that might interest you.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories
              .filter(cat => cat.slug !== category.slug)
              .slice(0, 6)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
