'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import ImageCard from '@/components/ImageCard'
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
  categories?: {
    name: string
    slug: string
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [categoryImages, setCategoryImages] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const category = categories.find(c => c.slug === params.slug)

  useEffect(() => {
    if (category) {
      fetchCategoryImages()
    } else {
      setError('Category not found')
      setLoading(false)
    }
  }, [params.slug, category])

  const fetchCategoryImages = async () => {
    if (!category) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/images?category=${category.id}`)
      const data = await response.json()
      
      if (data.success) {
        setCategoryImages(data.images)
      } else {
        setError('Failed to load images')
      }
    } catch (err) {
      setError('Failed to load images')
      console.error('Error fetching category images:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading {category?.name || 'category'} images...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Browse All Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">→</span>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800">Categories</Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-600">{category.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{category.name} Images</h1>
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {categoryImages.length} images
                </div>
              </div>
              <p className="text-gray-600 mb-6">{category.description}</p>
            </div>

            {/* Images Grid */}
            {categoryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {categoryImages.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding more {category.name.toLowerCase()} images to our collection.
                </p>
                <Link
                  href="/admin/ai-generator"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Generate {category.name} Images
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Category Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/admin/ai-generator"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Generate More {category.name} Images
                </Link>
                <Link
                  href="/categories"
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors text-center"
                >
                  Explore Other Categories
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* FluentLane Sidebar Ad */}
              <FluentLaneAd variant="sidebar" />

              {/* Category Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Images:</span>
                    <span className="font-medium">{categoryImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">All Free:</span>
                    <span className="font-medium text-green-600">✓ Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commercial Use:</span>
                    <span className="font-medium text-green-600">✓ Allowed</span>
                  </div>
                </div>
              </div>

              {/* Related Categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Categories</h3>
                <div className="space-y-2">
                  {categories
                    .filter(c => c.id !== category.id)
                    .slice(0, 5)
                    .map((relatedCategory) => (
                      <Link
                        key={relatedCategory.id}
                        href={`/category/${relatedCategory.slug}`}
                        className="block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        {relatedCategory.name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 