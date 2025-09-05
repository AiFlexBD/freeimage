// Image optimization utilities for Supabase Storage

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'png' | 'jpg' | 'avif'
  resize?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  cache?: boolean // Whether to use aggressive caching
}

// Default optimization presets
export const IMAGE_PRESETS = {
  thumbnail: { width: 400, height: 300, quality: 80, format: 'webp' as const, resize: 'cover' as const, cache: true },
  card: { width: 600, height: 400, quality: 85, format: 'webp' as const, resize: 'cover' as const, cache: true },
  preview: { width: 800, height: 600, quality: 90, format: 'webp' as const, resize: 'cover' as const, cache: true },
  hero: { width: 1200, height: 800, quality: 90, format: 'webp' as const, resize: 'cover' as const, cache: true },
  full: { width: 1920, height: 1080, quality: 95, format: 'webp' as const, resize: 'inside' as const, cache: true },
} as const

// Cache for optimized URLs to avoid repeated processing
const urlCache = new Map<string, string>()

/**
 * Generate optimized image URL using Supabase image transformations
 * @param originalUrl - Original Supabase storage URL
 * @param options - Optimization options or preset name
 * @returns Optimized image URL
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
  
  const { 
    width = 400, 
    height = 300, 
    quality = 80, 
    format = 'webp',
    resize = 'cover',
    cache = true
  } = opts
  
  // Check if it's a Supabase URL
  if (originalUrl.includes('supabase.co/storage')) {
    try {
      const url = new URL(originalUrl)
      
      // Add transformation parameters
      url.searchParams.set('width', width.toString())
      url.searchParams.set('height', height.toString())
      url.searchParams.set('resize', resize)
      url.searchParams.set('quality', quality.toString())
      url.searchParams.set('format', format)
      
      // Add cache control parameter for Supabase
      if (cache) {
        url.searchParams.set('t', Math.floor(Date.now() / (1000 * 60 * 60 * 24)).toString()) // Daily cache bust
      }
      
      const optimizedUrl = url.toString()
      
      // Cache the result
      urlCache.set(cacheKey, optimizedUrl)
      
      return optimizedUrl
    } catch (error) {
      console.warn('Failed to optimize image URL:', error)
      return originalUrl
    }
  }
  
  return originalUrl
}

/**
 * Generate multiple image sizes for responsive images with proper caching
 * @param originalUrl - Original image URL
 * @param sizes - Array of width sizes
 * @returns Object with srcSet and sizes strings
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
        quality: 85,
        format: 'webp',
        resize: 'cover',
        cache: true
      })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
  
  const sizesStr = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
  
  return { srcSet, sizes: sizesStr }
}

/**
 * Get blur placeholder for images (low quality, small size)
 * @param originalUrl - Original image URL
 * @returns Low quality placeholder URL
 */
export function getBlurPlaceholder(originalUrl: string): string {
  return getOptimizedImageUrl(originalUrl, {
    width: 40,
    height: 30,
    quality: 20,
    format: 'webp',
    resize: 'cover',
    cache: true
  })
}

/**
 * Preload critical images with proper cache headers
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

/**
 * Clear the URL cache (useful for development or when images are updated)
 */
export function clearImageCache(): void {
  urlCache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: urlCache.size,
    keys: Array.from(urlCache.keys())
  }
} 