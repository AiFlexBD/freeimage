'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/data/categories'
import ImageCard from '@/components/ImageCard'
import FluentLaneAd from '@/components/FluentLaneAd'
import AdSense from '@/components/AdSense'

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
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    imagesPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  const category = categories.find(c => c.slug === params.slug)

  useEffect(() => {
    if (category) {
      fetchCategoryImages()
    } else {
      setError('Category not found')
      setLoading(false)
    }
  }, [params.slug, category, currentPage])

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
      <div className="flex justify-center items-center mt-12 mb-8">
        <div className="flex items-center space-x-1">
          {pages}
        </div>
        <div className="ml-6 text-sm text-gray-600">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <nav className="mb-6">
              <ol className="flex items-center justify-center space-x-2 text-sm">
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
                <li className="text-gray-900 font-medium">{category.name}</li>
              </ol>
            </nav>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category.name} Images
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              {category.description}
            </p>
            
            {!loading && (
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {pagination.totalImages} Images
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  100% Free
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Commercial Use
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categoryImages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryImages.map((image) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>
                
                {/* Pagination */}
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-600 mb-6">
                  We haven't added any {category.name.toLowerCase()} images yet, but we're working on it!
                </p>
                <div className="space-y-3">
                  <Link
                    href="/categories"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Other Categories
                  </Link>
                  <div>
                    <Link
                      href="/search"
                      className="text-blue-600 hover:text-blue-800 text-sm"
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