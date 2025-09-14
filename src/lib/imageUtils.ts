// Conservative image optimization utilities for Supabase Storage with high reliability

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  resize?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

// Conservative presets - only basic resizing, no format conversion
export const IMAGE_PRESETS = {
  thumbnail: { width: 400, height: 300, resize: 'cover' as const },
  card: { width: 600, height: 400, resize: 'cover' as const },
  preview: { width: 800, height: 600, resize: 'cover' as const },
  hero: { width: 1200, height: 800, resize: 'cover' as const },
  full: { width: 1920, height: 1080, resize: 'inside' as const },
} as const

// Cache for tested URLs
const urlCache = new Map<string, string>()
const failedUrls = new Set<string>()

/**
 * Generate optimized image URL with conservative approach
 * @param originalUrl - Original Supabase storage URL
 * @param options - Optimization options or preset name
 * @returns Optimized image URL or original URL as fallback
 */
export function getOptimizedImageUrl(
  originalUrl: string, 
  options: ImageOptimizationOptions | keyof typeof IMAGE_PRESETS = 'thumbnail'
): string {
  if (!originalUrl) return originalUrl
  
  // If options is a string, use preset
  const opts = typeof options === 'string' ? IMAGE_PRESETS[options] : options
  
  // Create cache key
  const cacheKey = `${originalUrl}-${JSON.stringify(opts)}`
  
  // Return cached URL if available
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }
  
  // If this URL combination previously failed, return original
  if (failedUrls.has(cacheKey)) {
    return originalUrl
  }
  
  // Check if it's a Supabase URL
  if (!originalUrl.includes('supabase.co/storage')) {
    return originalUrl
  }
  
  try {
    const optimizedUrl = createOptimizedUrl(originalUrl, opts)
    
    // Cache and return optimized URL
    urlCache.set(cacheKey, optimizedUrl)
    return optimizedUrl
    
  } catch (error) {
    console.warn('Failed to create optimized image URL:', error)
    failedUrls.add(cacheKey)
    return originalUrl
  }
}

/**
 * Create optimized URL with only basic Supabase transformations
 */
function createOptimizedUrl(originalUrl: string, opts: ImageOptimizationOptions): string {
  const { 
    width = 400, 
    height = 300, 
    resize = 'cover'
  } = opts
  
  const url = new URL(originalUrl)
  
  // Only add basic transformation parameters that are most reliable
  url.searchParams.set('width', width.toString())
  url.searchParams.set('height', height.toString())
  url.searchParams.set('resize', resize)
  
  // Skip quality and format conversion to avoid errors
  
  return url.toString()
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(
  originalUrl: string,
  sizes: number[] = [400, 600, 800, 1200]
): { srcSet: string; sizes: string } {
  if (!originalUrl || !originalUrl.includes('supabase.co/storage')) {
    return { srcSet: originalUrl, sizes: '100vw' }
  }
  
  const srcSet = sizes
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(originalUrl, {
        width,
        height: Math.round(width * 0.75), // 4:3 aspect ratio
        resize: 'cover'
      })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
  
  const sizesStr = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
  
  return { srcSet, sizes: sizesStr }
}

/**
 * Preload critical images with error handling
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    link.crossOrigin = 'anonymous'
    
    // Add error handling
    link.onerror = () => {
      console.warn('Failed to preload image:', url)
    }
    
    document.head.appendChild(link)
  })
}

/**
 * Smart image component props generator with conservative optimization
 */
export function getImageProps(
  originalUrl: string,
  preset: keyof typeof IMAGE_PRESETS = 'thumbnail'
): {
  src: string
  srcSet?: string
  sizes?: string
  loading: 'lazy' | 'eager'
  decoding: 'async'
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void
} {
  // Use original URL directly for now to ensure reliability
  const baseUrl = originalUrl
  
  return {
    src: baseUrl,
    loading: 'lazy',
    decoding: 'async',
    onError: (e) => {
      const target = e.currentTarget as HTMLImageElement
      console.warn('Image failed to load:', target.src)
      // Image already using original URL, so just log the error
    }
  }
}

/**
 * Clear caches (useful for development)
 */
export function clearImageCache(): void {
  urlCache.clear()
  failedUrls.clear()
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { 
  cached: number
  failed: number
  cachedUrls: string[]
  failedUrls: string[]
} {
  return {
    cached: urlCache.size,
    failed: failedUrls.size,
    cachedUrls: Array.from(urlCache.keys()),
    failedUrls: Array.from(failedUrls)
  }
} 