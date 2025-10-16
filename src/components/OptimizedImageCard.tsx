import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface OptimizedImageCardProps {
  image: {
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
  priority?: boolean
}

export default function OptimizedImageCard({ image, priority = false }: OptimizedImageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const getImageUrl = () => {
    const titleSlug = createSlug(image.title)
    
    if (image.categories?.slug) {
      return `/image/${image.categories.slug}/${titleSlug}`
    }
    
    return `/image/${image.id}`
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    // Add a small delay to prevent overwhelming the browser
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        { 
          rootMargin: '100px', // Increased margin for smoother loading
          threshold: 0.1 
        }
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => observer.disconnect()
    }, 50) // Small delay to prevent resource exhaustion

    return () => clearTimeout(timeoutId)
  }, [priority])

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Track download
      await fetch('/api/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id })
      })
      
      // Download the file
      const response = await fetch(image.download_url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${image.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Download error:', err)
      // Fallback
      window.open(image.download_url, '_blank')
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true) // Still show the card
  }

  const imageUrl = getImageUrl()
  
  // Use thumbnail for faster loading, fallback to full image
  const displayImageUrl = image.thumbnail_url || image.download_url

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={imageUrl}>
        <div className="relative aspect-video overflow-hidden bg-gray-100" ref={imgRef}>
          {/* Placeholder/Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}

          {/* Actual Image */}
          {isInView && (
            <img
              src={displayImageUrl}
              alt={image.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } hover:scale-105`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-xs">Image unavailable</p>
              </div>
            </div>
          )}

          {/* AI Generated Badge */}
          {image.tags?.includes('ai-generated') && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              AI Generated
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="absolute top-2 left-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Download image"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </Link>
      
      <div className="p-3 sm:p-4">
        <Link href={imageUrl}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
            {image.title}
          </h3>
        </Link>
        
        {image.description && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {image.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {image.categories && (
              <Link 
                href={`/category/${image.categories.slug}`}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium truncate"
              >
                {image.categories.name}
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-1 text-gray-500 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">{image.downloads}</span>
              <span className="sm:hidden">{image.downloads > 999 ? `${Math.floor(image.downloads / 1000)}k` : image.downloads}</span>
            </div>
            
            <button
              onClick={handleDownload}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
