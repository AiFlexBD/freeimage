'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import ImageCard from '@/components/ImageCard'
import AdSense from '@/components/AdSense'
import FluentLaneAd from '@/components/FluentLaneAd'
import { getOptimizedImageUrl } from '@/lib/imageUtils'

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
  const [heroReady, setHeroReady] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Preload hero images
  useEffect(() => {
    if (featuredImages.length > 0) {
      let loadedCount = 0
      const totalImages = Math.min(featuredImages.length, 8) // Preload first 8 images
      
      featuredImages.slice(0, totalImages).forEach((image) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setImagesLoaded(loadedCount)
        }
        img.onerror = () => {
          loadedCount++
          setImagesLoaded(loadedCount)
        }
        img.src = getOptimizedImageUrl(image.thumbnail_url || image.download_url, 'thumbnail')
      })
    }
  }, [featuredImages])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch featured images for hero section (limited)
      const imagesResponse = await fetch('/api/images?limit=12')
      const imagesData = await imagesResponse.json()
      
      // Fetch category statistics efficiently
      const statsResponse = await fetch('/api/categories/stats')
      const statsData = await statsResponse.json()
      
      // Fetch featured images for categories
      const featuredResponse = await fetch('/api/categories/featured')
      const featuredData = await featuredResponse.json()
      
      if (imagesData.success && statsData.success && featuredData.success) {
        // Set featured images for hero
        setFeaturedImages(imagesData.images || [])
        
        // Set hero as ready when we have images
        if (imagesData.images && imagesData.images.length > 0) {
          setHeroReady(true)
        }
        
        // Create categories data with accurate counts and featured images
        const categoriesData = categories.map(category => {
          const imageCount = statsData.stats[category.id] || 0
          const featuredImage = featuredData.featured[category.id]
          
          return {
            ...category,
            imageCount,
            featuredImage
          }
        }).slice(0, 8) // Show only first 8 categories
        
        setCategoriesWithImages(categoriesData)
      } else {
        setError('Failed to load data')
        // Still show hero even if no images
        setHeroReady(true)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
      // Still show hero even on error
      setHeroReady(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value
      if (query.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`
      }
    }
  }

  const popularSearches = ['nature', 'business', 'technology', 'food', 'abstract', 'people', 'travel', 'lifestyle']

  if (!heroReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">ImageGenFree</h1>
                <p className="text-xl text-white/90">Loading amazing AI images...</p>
              </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Image Search Style */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 min-h-[80vh] hero-section">
        {/* Background Image Mosaic */}
        {featuredImages.length > 0 && (
          <div className="absolute inset-0 fade-in">
            <div className="hero-image-grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {Array.from({ length: 40 }, (_, index) => {
                const image = featuredImages[index % featuredImages.length]
                return (
                  <div key={`${image.id}-${index}`} className="relative overflow-hidden bg-gray-300">
                    <img
                      src={getOptimizedImageUrl(image.thumbnail_url || image.download_url, 'thumbnail')}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.6) saturate(0.8)',
                        minHeight: '100px'
                      }}
                      loading={index < 8 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        // Fallback to a solid color if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.style.backgroundColor = `hsl(${(index * 137.5) % 360}, 50%, 60%)`
                      }}
                    />
                  </div>
                )
              })}
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
          </div>
        )}
        
        {/* Fallback background if no images */}
        {featuredImages.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        )}
        
        {/* Hero Content Overlay */}
        <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
          <div className="text-center text-white max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-lg leading-tight">
              Free AI Generated Images
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/95 font-light drop-shadow-md px-2 leading-relaxed">
              Download over {featuredImages.length > 0 ? featuredImages.length * 10 : 120}+ high-quality AI images for commercial use. No attribution required, royalty-free stock photos for websites, marketing, and social media.
            </p>

            {/* Search Bar - Primary Focus */}
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search free AI images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-full text-gray-900 placeholder-gray-500 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl border-0"
                />
                <button
                  onClick={() => searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
                  className="absolute right-2 top-2 sm:top-2 bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                  aria-label="Search AI images"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Popular Searches - SEO Keywords */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => window.location.href = `/search?q=${encodeURIComponent(term)}`}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm transition-all duration-200 border border-white/20 hover:border-white/40 whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Value Propositions - SEO Keywords */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-white/95 mb-6 sm:mb-8 px-2">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">{featuredImages.length > 0 ? featuredImages.length * 10 : 120}+</div>
                <div className="text-xs sm:text-sm font-medium mt-1">Free AI Images</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">100%</div>
                <div className="text-xs sm:text-sm font-medium mt-1">Commercial Use</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">No</div>
                <div className="text-xs sm:text-sm font-medium mt-1">Attribution</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">HD</div>
                <div className="text-xs sm:text-sm font-medium mt-1">Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google AdSense - Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <AdSense 
            slot="1234567890" 
            style={{ width: '728px', height: '90px' }} 
          />
        </div>
      </div>

      {/* Categories Section - Visual Grid */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Browse by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Find the perfect image for your project
            </p>
          </div>

          {categoriesWithImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {categoriesWithImages.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-square hover:shadow-xl transition-all duration-300"
                >
                  {category.featuredImage ? (
                    <img
                      src={category.featuredImage.thumbnail_url || category.featuredImage.download_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Category Info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 group-hover:text-yellow-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {category.imageCount} images
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-600">Loading categories...</p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/categories"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              View All Categories
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Google AdSense - Mid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <AdSense 
            slot="2345678901" 
            style={{ width: '300px', height: '250px' }} 
          />
        </div>
      </div>

      {/* Featured Images - Masonry Style */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Free Stock Images
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                High-quality images you can use anywhere
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex sm:hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              See all images
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredImages.length > 0 ? (
            <>
              {/* Masonry Grid - Better Mobile Layout */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {featuredImages.slice(0, 12).map((image, index) => (
                  <div key={image.id} className="break-inside-avoid">
                    <div className="group relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl transition-all duration-300">
                      <img
                        src={getOptimizedImageUrl(image.thumbnail_url || image.download_url, 'thumbnail')}
                        alt={image.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ 
                          aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '3/4' : '1/1' 
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      
                      {/* Image Actions */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          href={`/image/${categories.find(c => c.id === image.category_id)?.slug}/${image.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`}
                          className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg backdrop-blur-sm transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>

                      {/* Image Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-medium text-sm truncate">{image.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/80 text-xs">Free to use</span>
                          <div className="flex items-center text-white/80 text-xs">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {image.downloads}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Link
                  href="/categories"
                  className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Explore All Images
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading images...</p>
            </div>
          )}
        </div>
      </section>

      {/* FluentLane Ad - Single Strategic Placement */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FluentLaneAd variant="inline" />
        </div>
      </section>

      {/* Features Section - Simplified */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Images?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free</h3>
              <p className="text-gray-600">No attribution required. Use for personal and commercial projects.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Generated</h3>
              <p className="text-gray-600">Unique images created with cutting-edge AI technology.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">Professional-grade images perfect for any project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google AdSense - Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <AdSense 
            slot="4567890123" 
            style={{ width: '728px', height: '90px' }} 
          />
        </div>
      </div>

      {/* FluentLane Ad */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FluentLaneAd variant="banner" />
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ImageGenFree for AI Generated Images?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The ultimate destination for high-quality, royalty-free AI images. Perfect for businesses, marketers, designers, and content creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free Forever</h3>
              <p className="text-gray-600">
                Download unlimited AI generated images without any cost. No hidden fees, no subscriptions, no watermarks. Completely free for personal and commercial use.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commercial License</h3>
              <p className="text-gray-600">
                Use our AI images for websites, marketing campaigns, social media posts, print materials, and any commercial project. No attribution required.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High-Quality AI Art</h3>
              <p className="text-gray-600">
                Every image is generated using advanced AI technology, ensuring crisp, detailed, and professional-quality results for your creative projects.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Popular AI Image Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                'Nature Photography', 'Business Images', 'Technology Graphics', 'Food Photography',
                'Abstract Art', 'People & Portraits', 'Travel Destinations', 'Lifestyle Photos'
              ].map((category, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="text-sm font-medium text-gray-800">{category}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>Perfect for:</strong> Web designers, marketers, bloggers, social media managers, small businesses, 
                content creators, students, and anyone needing high-quality stock photos without the cost.
              </p>
              <p className="text-sm text-gray-500">
                All images are AI-generated and royalty-free. Use them in websites, presentations, marketing materials, 
                social media posts, print designs, and commercial projects without worrying about licensing fees or copyright issues.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 