'use client'

interface FluentLaneAdProps {
  variant?: 'banner' | 'card' | 'sidebar' | 'floating' | 'inline'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function FluentLaneAd({ 
  variant = 'card', 
  size = 'medium',
  className = '' 
}: FluentLaneAdProps) {
  const handleClick = () => {
    // Track click for analytics
    if (typeof window !== 'undefined') {
      // You can add analytics tracking here
      window.open('https://fluentlane.com/', '_blank', 'noopener,noreferrer')
    }
  }

  const handleCloseFloating = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Find the floating ad element and remove it safely
    const floatingAd = (e.target as HTMLElement).closest('.fluentlane-floating') as HTMLElement
    if (floatingAd && floatingAd.parentNode) {
      try {
        floatingAd.style.display = 'none' // Hide instead of removing
      } catch (error) {
        console.error('Error hiding floating ad:', error)
      }
    }
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">FL</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Improve Your English with FluentLane</h3>
              <p className="text-purple-100">Practice speaking with AI tutors. Get instant feedback!</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">FL</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Master English with AI</h3>
            <p className="text-gray-600 text-sm mb-4">
              Practice conversations with AI tutors. Get personalized feedback and improve your fluency.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">AI Tutor</span>
              </div>
              <div className="text-xs text-gray-500">
                "Hello! Ready to practice English?"
              </div>
            </div>
            <button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Try FluentLane Free
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">FL</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Speak English Fluently</h3>
          <p className="text-xs text-gray-600 mb-3">
            AI-powered conversation practice with instant feedback
          </p>
          <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">AI</span>
              </div>
              <div className="text-xs text-gray-600">Practice Partner</div>
            </div>
            <div className="text-xs text-gray-800 italic">"Let's practice ordering food at a restaurant"</div>
          </div>
          <button
            onClick={handleClick}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <div className={`fluentlane-floating fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 relative">
          <button
            onClick={handleCloseFloating}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Improve Your English</h4>
              <p className="text-xs text-gray-600 mb-3">
                Practice with AI tutors. Get instant feedback!
              </p>
              <button
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Try Free
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Master English with FluentLane</h3>
              <p className="text-xs text-gray-600">AI tutors • Instant feedback • Personalized lessons</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex-shrink-0"
          >
            Learn More
          </button>
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">FL</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">FluentLane</h3>
          <p className="text-xs text-gray-600">AI English Learning</p>
        </div>
        <button
          onClick={handleClick}
          className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors"
        >
          Try Free
        </button>
      </div>
    </div>
  )
} 