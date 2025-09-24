'use client'

import { useState, useCallback } from 'react'
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/lib/imageUtils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Generate optimized URLs for different screen sizes
  const generateSrcSet = useCallback(() => {
    if (!src || !src.includes('supabase.co/storage')) {
      return undefined
    }

    const sizes = [400, 600, 800, 1200]
    return sizes
      .map(size => {
        const optimizedUrl = getOptimizedImageUrl(src, {
          width: size,
          height: Math.round(size * 0.75),
          resize: 'cover'
        })
        return `${optimizedUrl} ${size}w`
      })
      .join(', ')
  }, [src])

  // Use optimized URL for main src
  const optimizedSrc = getOptimizedImageUrl(src, {
    width: width || 600,
    height: height || 400,
    resize: 'cover'
  })

  const srcSet = generateSrcSet()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: width && height ? width / height : '4/3' }}
        />
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ aspectRatio: width && height ? width / height : '4/3' }}
        >
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ aspectRatio: width && height ? width / height : '4/3' }}
      />
    </div>
  )
}
