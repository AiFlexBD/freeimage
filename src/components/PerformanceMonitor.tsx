'use client'

import { useEffect, useState } from 'react'
import { getPerformanceMetrics } from '@/lib/performance'

interface PerformanceData {
  domContentLoaded: number
  loadComplete: number
  totalResources: number
  memory?: {
    used: number
    total: number
    limit: number
  } | null
}

export default function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    const updatePerformanceData = () => {
      const metrics = getPerformanceMetrics()
      if (metrics) {
        setPerformanceData(metrics)
      }
    }

    // Update performance data after page load
    const timer = setTimeout(updatePerformanceData, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Don't render in production
  if (process.env.NODE_ENV !== 'development' || !performanceData) {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border p-4 w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">DOM Content Loaded:</span>
              <span className="font-mono">{formatTime(performanceData.domContentLoaded)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Load Complete:</span>
              <span className="font-mono">{formatTime(performanceData.loadComplete)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Resources:</span>
              <span className="font-mono">{performanceData.totalResources}</span>
            </div>

            {performanceData.memory && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Used:</span>
                  <span className="font-mono">{formatBytes(performanceData.memory.used)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Total:</span>
                  <span className="font-mono">{formatBytes(performanceData.memory.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Limit:</span>
                  <span className="font-mono">{formatBytes(performanceData.memory.limit)}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t">
            <div className="text-xs text-gray-500">
              <p>Core Web Vitals:</p>
              <p>• LCP: Largest Contentful Paint</p>
              <p>• INP: Interaction to Next Paint</p>
              <p>• CLS: Cumulative Layout Shift</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
