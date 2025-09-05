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
  width?: number
  height?: number
  file_size?: number
  slug?: string
  categories?: {
    name: string
    slug: string
  }
}

export default function ImagePageClient({ params }: { params: { category: string; slug: string } }) {
  const [image, setImage] = useState<DatabaseImage | null>(null)
  const [relatedImages, setRelatedImages] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchImage()
  }, [params.category, params.slug])

  const fetchImage = async () => {
    try {
      setLoading(true)
      
      // Fetch all images and find by category and slug
      const response = await fetch(`/api/images?limit=200`)
      const data = await response.json()
      
      if (data.success) {
        // Find image by category and slug
        const foundImage = data.images.find((img: DatabaseImage) => {
          const imageSlug = createSlug(img.title)
          const category = categories.find(c => c.id === img.category_id)
          return category?.slug === params.category && imageSlug === params.slug
        })
        
        if (foundImage) {
          setImage(foundImage)
          
          // Fetch related images from the same category
          const related = data.images.filter((img: DatabaseImage) => 
            img.category_id === foundImage.category_id && img.id !== foundImage.id
          ).slice(0, 4)
          
          setRelatedImages(related)
        } else {
          setError('Image not found')
        }
      } else {
        setError('Failed to load image')
      }
    } catch (err) {
      setError('Failed to load image')
      console.error('Error fetching image:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleDownload = async () => {
    if (!image) return
    
    try {
      // Track download first
      const trackResponse = await fetch('/api/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id })
      })
      
      if (trackResponse.ok) {
        // Update local download count immediately
        setImage(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null)
      }
      
      // Download the actual file
      const response = await fetch(image.download_url)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename from title or use default
      const filename = `${image.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`
      link.download = filename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Download error:', err)
      
      // Fallback: still try to track and open in new tab
      try {
        await fetch('/api/images/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: image.id })
        })
        setImage(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null)
      } catch (trackErr) {
        console.error('Download tracking fallback error:', trackErr)
      }
      
      // Fallback download method
      window.open(image.download_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading image...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !image) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Image not found</h1>
              <p className="text-gray-600 mb-6">The image you're looking for doesn't exist or has been removed.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const category = categories.find(c => c.id === image.category_id)

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">→</span>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800">Categories</Link>
            {category && (
              <>
                <span className="text-gray-400">→</span>
                <Link href={`/category/${category.slug}`} className="text-blue-600 hover:text-blue-800">
                  {category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">→</span>
            <span className="text-gray-600">{image.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Display */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={image.download_url}
                  alt={image.title}
                  className="w-full h-auto object-contain max-h-[600px]"
                />
                {image.tags?.includes('ai-generated') && (
                  <div className="absolute top-4 right-4 bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                    AI Generated
                  </div>
                )}
              </div>
            </div>

            {/* FluentLane Ad Card - Below Image */}
            <div className="mt-8">
              <FluentLaneAd variant="card" />
            </div>
          </div>

          {/* Image Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {image.title}
              </h1>
              
              {image.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {image.description}
                </p>
              )}

              {/* Download Button */}
              <button 
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mb-6 font-medium"
              >
                Download Free (High Resolution)
              </button>

              {/* Image Details */}
              <div className="space-y-4 border-t pt-6">
                {category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Link href={`/category/${category.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {category.name}
                    </Link>
                  </div>
                )}
                
                {image.width && image.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="text-gray-900 font-medium">{image.width} × {image.height}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="text-gray-900 font-medium">{image.downloads}</span>
                </div>
                
                {image.file_size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="text-gray-900 font-medium">
                      {(image.file_size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(image.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span className="text-green-600 font-medium">Free for commercial use</span>
                </div>
              </div>

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Images */}
        {relatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More {category?.name} Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedImages.map((relatedImage) => (
                <ImageCard key={relatedImage.id} image={relatedImage} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Looking for more images?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our collection of AI-generated images across all categories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Categories
              </Link>
              <Link
                href="/admin/ai-generator"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 transition-colors"
              >
                Generate Custom Images
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 