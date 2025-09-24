'use client'

import Link from 'next/link'
import { useState, useCallback, memo } from 'react'
import OptimizedImage from './OptimizedImage'

interface ImageCardProps {
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

function PerformanceImageCard({ image, priority = false }: ImageCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const createSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  const getImageUrl = useCallback(() => {
    const titleSlug = createSlug(image.title)
    
    if (image.categories?.slug) {
      return `/image/${image.categories.slug}/${titleSlug}`
    }
    
    return `/image/${image.id}`
  }, [image.categories?.slug, image.id, image.title, createSlug])

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDownloading) return
    
    setIsDownloading(true)
    
    try {
      // Track download first
      await fetch('/api/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id })
      })
      
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
      } catch (trackErr) {
        console.error('Download tracking fallback error:', trackErr)
      }
      
      // Fallback download method
      window.open(image.download_url, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }, [image.id, image.download_url, image.title, isDownloading])

  const imageUrl = getImageUrl()

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={imageUrl} className="block">
        <div className="relative aspect-video overflow-hidden">
          <OptimizedImage
            src={image.thumbnail_url || image.download_url}
            alt={image.title}
            width={600}
            height={400}
            priority={priority}
            className="hover:scale-105 transition-transform duration-300"
          />
          
          {image.tags?.includes('ai-generated') && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              AI Generated
            </div>
          )}
          
          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="absolute top-2 left-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
            title="Download image"
            aria-label={`Download ${image.title}`}
          >
            {isDownloading ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
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
              disabled={isDownloading}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(PerformanceImageCard)
