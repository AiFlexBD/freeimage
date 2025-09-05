'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  style?: React.CSSProperties
  className?: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
}

// AdSense component for displaying ads
export default function AdSense({ slot, style, className, format = 'auto' }: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle && process.env.NODE_ENV === 'production') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  // Check if AdSense is enabled
  const isAdSenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  // Development mode or AdSense disabled - show placeholder
  if (process.env.NODE_ENV === 'development' || !isAdSenseEnabled || !publisherId) {
    return (
      <div 
        className={`bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-center p-4">
          <div className="text-gray-600 font-semibold mb-2">
            {process.env.NODE_ENV === 'development' ? '🚧 Dev Mode' : '❌ AdSense Disabled'}
          </div>
          <div className="text-gray-500 text-sm mb-1">
            {style?.width && style?.height 
              ? `Ad Space (${style.width} × ${style.height})` 
              : 'Advertisement Placeholder'
            }
          </div>
          <div className="text-gray-400 text-xs mt-1">Slot: {slot}</div>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-gray-400 text-xs mt-1">
              {publisherId ? '✅ Publisher ID Set' : '❌ No Publisher ID'}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Production mode - actual AdSense
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}

// AdSense initialization component
export function AdSenseInit() {
  useEffect(() => {
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
    const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && isEnabled && publisherId) {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`)
      
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        script.onload = () => {
          console.log('AdSense script loaded successfully')
        }
        script.onerror = () => {
          console.error('Failed to load AdSense script')
        }
        document.head.appendChild(script)
      }
    }
  }, [])

  return null
} 