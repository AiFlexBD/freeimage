'use client'

import { useEffect } from 'react'
import { initializePerformanceOptimizations } from '@/lib/performance'

interface PerformanceLayoutProps {
  children: React.ReactNode
}

export default function PerformanceLayout({ children }: PerformanceLayoutProps) {
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
