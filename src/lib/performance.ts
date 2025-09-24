// Performance optimization utilities for Core Web Vitals

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  const criticalResources = [
    { href: '/api/images', as: 'fetch', crossOrigin: 'anonymous' },
    { href: '/api/categories', as: 'fetch', crossOrigin: 'anonymous' }
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.href
    link.as = resource.as
    if (resource.crossOrigin) {
      link.crossOrigin = resource.crossOrigin
    }
    document.head.appendChild(link)
  })
}

/**
 * Optimize images for better LCP
 */
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return

  // Add loading="eager" to above-the-fold images
  const aboveFoldImages = document.querySelectorAll('img[data-priority="true"]')
  aboveFoldImages.forEach(img => {
    img.setAttribute('loading', 'eager')
    img.setAttribute('fetchpriority', 'high')
  })

  // Add loading="lazy" to below-the-fold images
  const belowFoldImages = document.querySelectorAll('img:not([data-priority="true"])')
  belowFoldImages.forEach(img => {
    img.setAttribute('loading', 'lazy')
  })
}

/**
 * Reduce CLS by setting image dimensions
 */
export function preventLayoutShift() {
  if (typeof window === 'undefined') return

  const images = document.querySelectorAll('img:not([width]):not([height])')
  images.forEach(img => {
    const aspectRatio = 4/3 // Default aspect ratio
    const width = img.getBoundingClientRect().width
    const height = width / aspectRatio
    
    img.setAttribute('width', width.toString())
    img.setAttribute('height', height.toString())
  })
}

/**
 * Optimize JavaScript execution for better INP
 */
export function optimizeJavaScriptExecution() {
  if (typeof window === 'undefined') return

  // Use requestIdleCallback for non-critical tasks
  const runWhenIdle = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback)
    } else {
      setTimeout(callback, 1)
    }
  }

  // Defer non-critical scripts
  const deferScripts = () => {
    const scripts = document.querySelectorAll('script[data-defer]')
    scripts.forEach(script => {
      const newScript = document.createElement('script')
      newScript.src = script.getAttribute('src') || ''
      newScript.async = true
      script.parentNode?.replaceChild(newScript, script)
    })
  }

  runWhenIdle(deferScripts)
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals() {
  if (typeof window === 'undefined') return

  // Monitor LCP
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    })
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP monitoring not supported')
    }

    // Monitor CLS
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      console.log('CLS:', clsValue)
    })
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS monitoring not supported')
    }

    // Monitor INP (Interaction to Next Paint)
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('processingStart' in entry && 'startTime' in entry) {
          console.log('INP:', (entry as any).processingStart - entry.startTime)
        }
      }
    })
    
    try {
      inpObserver.observe({ entryTypes: ['event'] })
    } catch (e) {
      console.warn('INP monitoring not supported')
    }
  }
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return

  // Run immediately
  preloadCriticalResources()
  optimizeImageLoading()
  preventLayoutShift()
  optimizeJavaScriptExecution()
  monitorWebVitals()

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImageLoading()
      preventLayoutShift()
    })
  }

  // Run after page load
  window.addEventListener('load', () => {
    optimizeImageLoading()
    preventLayoutShift()
  })
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  return {
    // Page load metrics
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Resource metrics
    totalResources: performance.getEntriesByType('resource').length,
    
    // Memory usage (if available)
    memory: (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit
    } : null
  }
}
