'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import AdSense from '@/components/AdSense'
import FluentLaneAd from '@/components/FluentLaneAd'

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

interface CategoryWithStats {
  id: string
  name: string
  slug: string
  description: string
  realImageCount: number
  realImage?: DatabaseImage
}

export default function CategoriesPage() {
  const [categoriesWithStats, setCategoriesWithStats] = useState<CategoryWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalImages, setTotalImages] = useState(0)

  useEffect(() => {
    fetchCategoriesWithStats()
  }, [])

  const fetchCategoriesWithStats = async () => {
    try {
      setLoading(true)
      
      // Fetch categories from API
      const categoriesResponse = await fetch('/api/categories')
      const categoriesData = await categoriesResponse.json()
      
      if (Array.isArray(categoriesData)) {
        // Fetch images to get sample images for each category
        const imagesResponse = await fetch('/api/images?limit=1000')
        const imagesData = await imagesResponse.json()
        
        if (imagesData.success) {
          const allImages = imagesData.images
          setTotalImages(allImages.length)
          
          const categoriesWithStats = categoriesData.map(category => {
            const categoryImages = allImages.filter((img: DatabaseImage) => img.category_id === category.id)
            const firstImage = categoryImages[0]
            
            return {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description || `${category.name} images`,
              realImageCount: category.image_count || categoryImages.length,
              realImage: firstImage
            }
          })
          
          setCategoriesWithStats(categoriesWithStats)
        } else {
          // Fallback: use categories without images
          const categoriesWithStats = categoriesData.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || `${category.name} images`,
            realImageCount: category.image_count || 0,
            realImage: undefined
          }))
          
          setCategoriesWithStats(categoriesWithStats)
        }
      } else {
        setError('Failed to load categories')
      }
    } catch (err) {
      setError('Failed to load categories')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
            onClick={fetchCategoriesWithStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const activeCategories = categoriesWithStats.filter(cat => cat.realImageCount > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Image Categories
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Explore our diverse collection of AI-generated images across different categories. 
              All images are free to download and use for commercial purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Gallery Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Gallery Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalImages}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Images</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{activeCategories.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Active Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Free to Use</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">AI</div>
                  <div className="text-xs sm:text-sm text-gray-600">Generated</div>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            {categoriesWithStats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {categoriesWithStats.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {category.realImage ? (
                        <img
                          src={category.realImage.thumbnail_url || category.realImage.download_url}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-400">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {category.realImageCount} images
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 sm:mb-2 text-sm sm:text-base">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                        {category.description}
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

            {/* AdSense - Better Position After Categories */}
            <div className="flex justify-center mb-8">
              <AdSense 
                slot="5678901234" 
                style={{ width: '300px', height: '250px' }} 
              />
            </div>
          </div>
        </div>

        {/* AdSense - Bottom */}
        <div className="flex justify-center mt-12">
          <AdSense 
            slot="5678901234" 
            style={{ width: '728px', height: '90px' }} 
          />
        </div>

        {/* FluentLane Banner - Bottom */}
        <div className="mt-12">
          <FluentLaneAd variant="banner" />
        </div>
      </div>
    </div>
  )
} 