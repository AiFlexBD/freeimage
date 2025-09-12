'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageCard from '@/components/ImageCard'
import AdSense from '@/components/AdSense'
import FluentLaneAd from '@/components/FluentLaneAd'
import { getOptimizedImageUrl, preloadImages } from '@/lib/imageUtils'
import { categories } from '@/data/categories'

interface DatabaseImage {
  id: string
  title: string
  category_id: string
  download_url: string
  thumbnail_url?: string
  downloads: number
  created_at: string
}

interface CategoryWithImage {
  id: string
  name: string
  slug: string
  description: string
  imageCount: number
  featuredImage?: DatabaseImage
}

export default function HomePage() {
  const [featuredImages, setFeaturedImages] = useState<DatabaseImage[]>([])
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Single optimized API call for all homepage data
      const response = await fetch('/api/homepage')

      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.data) {
          setFeaturedImages(data.data.images || [])
          setCategoriesWithImages(data.data.categories || [])
          
          // Preload category images for better performance
          const imagesToPreload = data.data.categories
            .slice(0, 4) // Only preload first 4 images
            .filter((cat: any) => cat.featuredImage)
            .map((cat: any) => getOptimizedImageUrl(cat.featuredImage.thumbnail_url || cat.featuredImage.download_url, 'thumbnail'))
          
          if (imagesToPreload.length > 0) {
            preloadImages(imagesToPreload)
          }
        }
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularTags = [
    'Business', 'Nature', 'Technology', 'People', 'Abstract', 'Food', 'Travel', 'Lifestyle'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing images...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Optimized Hero Section */}
      <section className="relative min-h-[80vh] hero-section">
        {/* Single Optimized Background Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.75) 0%, rgba(147, 51, 234, 0.75) 100%), url("https://dalleproduse.blob.core.windows.net/private/images/5c3040f8-98ae-42b4-8803-a762896e58fb/generated_00.png?se=2025-09-13T00%3A34%3A59Z&sig=9buwCvQxqsid7E9bKIq4Bp4Mco73lUjIa%2BfvENIlCuM%3D&ske=2025-09-18T04%3A48%3A39Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2025-09-11T04%3A48%3A39Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02")`
            }}
          >
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Free AI Generated
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Stock Images
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed">
              Download thousands of high-quality AI images for free. Perfect for websites, marketing, and commercial projects.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images... (e.g., business meeting, nature landscape)"
                  className="w-full px-6 py-4 pl-12 pr-20 text-lg rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                    Search
                  </span>
                </button>
              </form>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(tag.toLowerCase())}`)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/categories')}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Categories
              </button>
              <button
                onClick={() => router.push('/generate')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🎨 Create AI Image
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FluentLane Ad - Strategic Placement */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FluentLaneAd variant="banner" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Image Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thousands of AI-generated images across various categories, all free to download and use.
            </p>
          </div>

          {categoriesWithImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoriesWithImages.slice(0, 8).map((category) => (
                <div
                  key={category.id}
                  onClick={() => router.push(`/category/${category.slug}`)}
                  className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {category.featuredImage ? (
                      <img
                        src={getOptimizedImageUrl(category.featuredImage.thumbnail_url || category.featuredImage.download_url, 'thumbnail')}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading={category.imageCount <= 4 ? "eager" : "lazy"} // Eager load first 4 categories
                        decoding="async"
                        onError={(e) => {
                          // Fallback to placeholder on error
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.imageCount.toLocaleString()} images
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading categories...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/categories')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              View All Categories
            </button>
          </div>
        </div>
      </section>

      {/* AdSense - Strategic Placement */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSense slot="homepage-middle" />
        </div>
      </section>

      {/* Featured Images */}
      {featuredImages.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Images
              </h2>
              <p className="text-xl text-gray-600">
                High-quality AI-generated images ready for download
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredImages.slice(0, 8).map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => router.push('/categories')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Explore More Images
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ImageGenFree?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Free</h3>
              <p className="text-gray-600">No attribution required. Use for personal and commercial projects without any restrictions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated</h3>
              <p className="text-gray-600">Unique, high-quality images created with cutting-edge AI technology and enhanced features.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Download</h3>
              <p className="text-gray-600">Download high-resolution images instantly. No sign-up required, no waiting time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 