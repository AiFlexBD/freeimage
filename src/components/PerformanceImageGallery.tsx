'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import PerformanceImageCard from './PerformanceImageCard'
import { createIntersectionObserver } from '@/lib/performance'

interface Image {
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

interface PerformanceImageGalleryProps {
  images: Image[]
  category?: string
  loadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

const ImageGrid = memo(({ images, category }: { images: Image[], category?: string }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {images.map((image, index) => (
      <PerformanceImageCard 
        key={image.id} 
        image={image} 
        priority={index < 8} // Prioritize first 8 images
      />
    ))}
  </div>
))

export default function PerformanceImageGallery({ 
  images, 
  category, 
  loadMore, 
  hasMore = false, 
  loading = false 
}: PerformanceImageGalleryProps) {
  const [visibleImages, setVisibleImages] = useState<Image[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Initialize visible images
  useEffect(() => {
    setVisibleImages(images.slice(0, 20)) // Show first 20 images initially
  }, [images])

  // Load more images when scrolling
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const currentCount = visibleImages.length
    const nextBatch = images.slice(currentCount, currentCount + 20)
    
    setVisibleImages(prev => [...prev, ...nextBatch])
    
    if (loadMore) {
      loadMore()
    }
    
    setIsLoadingMore(false)
  }, [images, visibleImages.length, hasMore, loadMore, isLoadingMore])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return

    observerRef.current = createIntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore) {
          handleLoadMore()
        }
      },
      { rootMargin: '100px' }
    )

    if (observerRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleLoadMore, hasMore, isLoadingMore])

  if (loading && visibleImages.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Image Grid */}
      <ImageGrid images={visibleImages} category={category} />

      {/* Load More Button */}
      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isLoadingMore ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading more images...</span>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Load More Images
            </button>
          )}
        </div>
      )}

      {/* End of results */}
      {!hasMore && visibleImages.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            You've reached the end of the results. 
            {visibleImages.length} images found.
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && visibleImages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">
            Try adjusting your search or browse our categories.
          </p>
        </div>
      )}
    </div>
  )
}
