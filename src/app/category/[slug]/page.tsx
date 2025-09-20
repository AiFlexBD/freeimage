'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import ImageCard from '@/components/ImageCard'
import FluentLaneAd from '@/components/FluentLaneAd'
import AdSense from '@/components/AdSense'

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
      'Vibrant nebulas and star formations',
      'Inspiring and awe-inspiring imagery'
    ],
    'Pixel Art': [
      'Authentic retro gaming aesthetic',
      'Crisp, clean pixel-perfect graphics',
      'Nostalgic 8-bit and 16-bit style',
      'Perfect for indie games and retro designs',
      'Scalable without quality loss'
    ],
    'Aesthetic': [
      'Minimalist and clean design principles',
      'Perfect color harmony and balance',
      'Modern, trendy visual appeal',
      'Versatile for various design projects',
      'Instagram-worthy visual quality'
    ],
    'Lofi Music': [
      'Cozy, relaxing atmosphere and vibes',
      'Perfect for study and work environments',
      'Warm, muted color palettes',
      'Nostalgic and comforting imagery',
      'Ideal for music and lifestyle content'
    ],
    'Product': [
      'Professional commercial photography quality',
      'Perfect lighting and composition',
      'Clean, distraction-free backgrounds',
      'High-resolution for detailed product views',
      'E-commerce and marketing ready'
    ]
  }
  return features[categoryName] || [
    'High-resolution images suitable for print and digital use',
    '100% royalty-free with no attribution required',
    'AI-generated for unique, original content',
    'Regular updates with fresh, trending designs',
    'Instant download with no registration needed'
  ]
}

function getCategoryUseCases(categoryName: string): string[] {
  const useCases: Record<string, string[]> = {
    'Oil Painted': [
      'Art galleries and museum websites',
      'Fine art prints and posters',
      'Luxury brand marketing',
      'Interior design projects',
      'Art education materials',
      'Cultural and heritage websites'
    ],
    'Anime': [
      'Gaming websites and apps',
      'Manga and comic projects',
      'Anime streaming platforms',
      'Gaming merchandise',
      'Social media content',
      'Fan art and communities'
    ],
    'Space': [
      'Astronomy and science websites',
      'Sci-fi movie and game projects',
      'Educational materials',
      'Space agency websites',
      'Technology and innovation content',
      'Inspirational and motivational designs'
    ],
    'Pixel Art': [
      'Indie game development',
      'Retro gaming websites',
      'Nostalgic brand campaigns',
      'Gaming merchandise',
      'Tech startup branding',
      'Retro-themed events'
    ],
    'Aesthetic': [
      'Modern lifestyle brands',
      'Instagram and social media',
      'Minimalist web design',
      'Fashion and beauty content',
      'Wellness and self-care brands',
      'Contemporary art projects'
    ],
    'Lofi Music': [
      'Music streaming platforms',
      'Study and productivity apps',
      'Cafe and restaurant branding',
      'Lifestyle and wellness content',
      'Background music videos',
      'Cozy lifestyle brands'
    ],
    'Product': [
      'E-commerce websites',
      'Product catalogs',
      'Marketing campaigns',
      'Social media advertising',
      'Print advertisements',
      'Product packaging design'
    ]
  }
  return useCases[categoryName] || [
    'Website headers and hero sections',
    'Social media posts and stories',
    'Blog post illustrations',
    'Marketing materials and presentations',
    'Print designs and publications',
    'Mobile app interfaces'
  ]
}

function getCategoryTips(categoryName: string): string {
  const tips: Record<string, string> = {
    'Oil Painted': 'When using oil painted images, consider these artistic principles:',
    'Anime': 'For anime-style projects, keep these design considerations in mind:',
    'Space': 'When working with space imagery, consider these cosmic design tips:',
    'Pixel Art': 'For pixel art projects, remember these retro design principles:',
    'Aesthetic': 'When creating aesthetic designs, follow these minimalist guidelines:',
    'Lofi Music': 'For lofi music projects, consider these cozy design elements:',
    'Product': 'When showcasing products, apply these professional photography principles:'
  }
  return tips[categoryName] || `When using ${categoryName.toLowerCase()} images in your projects, consider these design principles:`
}

function getCategoryTipList(categoryName: string): string[] {
  const tipLists: Record<string, string[]> = {
    'Oil Painted': [
      'Use warm, rich color palettes to complement the oil painting aesthetic',
      'Consider the texture and brushstroke details in your design',
      'Pair with elegant, sophisticated typography',
      'Maintain the artistic integrity of the original painting style'
    ],
    'Anime': [
      'Use bold, vibrant colors that match anime art style',
      'Consider the dynamic energy and movement in compositions',
      'Pair with modern, clean typography for contrast',
      'Maintain the youthful, energetic feel of anime culture'
    ],
    'Space': [
      'Use dark backgrounds to make cosmic elements pop',
      'Consider the scale and grandeur of space in your layouts',
      'Pair with futuristic or scientific typography',
      'Maintain the sense of wonder and exploration'
    ],
    'Pixel Art': [
      'Keep designs clean and simple to match pixel art style',
      'Use limited color palettes for authentic retro feel',
      'Consider the grid-based nature of pixel art',
      'Maintain the nostalgic, gaming-inspired aesthetic'
    ],
    'Aesthetic': [
      'Use plenty of white space for clean, minimal look',
      'Stick to muted, harmonious color palettes',
      'Choose simple, elegant typography',
      'Focus on balance and visual harmony'
    ],
    'Lofi Music': [
      'Use warm, muted tones for cozy atmosphere',
      'Consider soft, rounded design elements',
      'Pair with handwritten or casual typography',
      'Maintain the relaxed, comfortable vibe'
    ],
    'Product': [
      'Ensure clean, distraction-free backgrounds',
      'Use consistent lighting and shadows',
      'Maintain high resolution for detailed views',
      'Consider the product\'s target audience and brand'
    ]
  }
  return tipLists[categoryName] || [
    'Maintain consistent color schemes across your design',
    'Use images that complement your brand\'s aesthetic',
    'Ensure proper contrast for text overlays',
    'Consider the emotional impact of your chosen images'
  ]
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

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalImages: number
  imagesPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [categoryImages, setCategoryImages] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState<any>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    imagesPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  })

  useEffect(() => {
    fetchCategory()
  }, [params.slug])

  useEffect(() => {
    if (category) {
      fetchCategoryImages()
    }
  }, [category, currentPage])

  const fetchCategory = async () => {
    try {
      setLoading(true)
      
      // First try to find in static categories
      const staticCategory = categories.find(c => c.slug === params.slug)
      if (staticCategory) {
        setCategory(staticCategory)
        return
      }
      
      // If not found, fetch from API
      const response = await fetch('/api/categories')
      const categoriesData = await response.json()
      
      if (Array.isArray(categoriesData)) {
        const foundCategory = categoriesData.find(c => c.slug === params.slug)
        if (foundCategory) {
          setCategory(foundCategory)
        } else {
          setError('Category not found')
        }
      } else {
        setError('Failed to load category')
      }
    } catch (err) {
      setError('Failed to load category')
      console.error('Error fetching category:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryImages = async () => {
    if (!category) return
    
    try {
      setLoading(true)
      
      // First, get total count for pagination
      const countResponse = await fetch(`/api/images?category=${category.id}&limit=1000`)
      const countData = await countResponse.json()
      
      // Then get paginated results
      const offset = (currentPage - 1) * 20
      const response = await fetch(`/api/images?category=${category.id}&limit=20&offset=${offset}`)
      const data = await response.json()
      
      if (data.success && countData.success) {
        setCategoryImages(data.images || [])
        
        const totalImages = countData.count || 0
        const imagesPerPage = 20
        const totalPages = Math.ceil(totalImages / imagesPerPage)
        
        setPagination({
          currentPage,
          totalPages,
          totalImages,
          imagesPerPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        })
      } else {
        setError('Failed to load images')
      }
    } catch (err) {
      console.error('Error fetching category images:', err)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

    // Previous button
    if (pagination.hasPrevPage) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border border-gray-300 rounded-l-md"
        >
          Previous
        </button>
      )
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm border-t border-b border-gray-300 ${
            i === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    if (pagination.hasNextPage) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border border-gray-300 rounded-r-md"
        >
          Next
        </button>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row justify-center items-center mt-8 sm:mt-12 mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-1 order-2 sm:order-1">
          {pages}
        </div>
        <div className="sm:ml-6 text-xs sm:text-sm text-gray-600 order-1 sm:order-2">
          Showing {((currentPage - 1) * pagination.imagesPerPage) + 1} to{' '}
          {Math.min(currentPage * pagination.imagesPerPage, pagination.totalImages)} of{' '}
          {pagination.totalImages} images
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="text-center">
            <nav className="mb-4 sm:mb-6">
              <ol className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li>
                  <Link href="/categories" className="text-blue-600 hover:text-blue-800">
                    Categories
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium truncate max-w-[100px] sm:max-w-none">{category.name}</li>
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-4">
              {category.name} Images
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              {category.description}
            </p>
            
            {!loading && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs sm:text-sm text-gray-500 px-4">
                <span className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {pagination.totalImages} Images
                </span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  100% Free
                </span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Commercial Use
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Category Content */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Discover High-Quality {category.name} Images
            </h2>
            <p className="mb-6">
              {getCategoryDescription(category.name)}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ✨ Why Choose Our {category.name} Images?
                </h3>
                <ul className="space-y-2 text-sm">
                  {getCategoryFeatures(category.name).map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎯 Perfect For
                </h3>
                <ul className="space-y-2 text-sm">
                  {getCategoryUseCases(category.name).map((useCase, index) => (
                    <li key={index}>• {useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Pro Design Tips
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                {getCategoryTips(category.name)}
              </p>
              <ul className="text-blue-800 text-sm space-y-1">
                {getCategoryTipList(category.name).map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-3 sm:p-4">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categoryImages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categoryImages.map((image) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>
                
                {/* Pagination */}
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No images found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  We haven't added any {category.name.toLowerCase()} images yet, but we're working on it!
                </p>
                <div className="space-y-3">
                  <Link
                    href="/categories"
                    className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Browse Other Categories
                  </Link>
                  <div>
                    <Link
                      href="/search"
                      className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                    >
                      Or search for specific images →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
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

              {/* AdSense Ad */}
              <div className="bg-white rounded-lg p-4 text-center border-2 border-dashed border-gray-300">
                <AdSense
                  slot="9876543210"
                  style={{ width: '250px', height: '300px' }}
                />
              </div>

              {/* FluentLane Ad */}
              <FluentLaneAd variant="sidebar" />

              {/* SEO Content */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About {category.name} Images
                </h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <p>
                    Discover our collection of high-quality {category.name.toLowerCase()} images, 
                    perfect for your creative projects. All images are AI-generated and free to use 
                    for both personal and commercial purposes.
                  </p>
                  <p>
                    <strong>Usage Rights:</strong> All {category.name.toLowerCase()} images can be used 
                    without attribution for websites, marketing materials, social media, presentations, 
                    and print projects.
                  </p>
                  <p>
                    <strong>Quality:</strong> High-resolution images optimized for web and print use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 