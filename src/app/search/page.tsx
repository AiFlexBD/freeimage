'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ImageCard from '@/components/ImageCard'
import AdSense from '@/components/AdSense'
import FluentLaneAd from '@/components/FluentLaneAd'

interface DatabaseImage {
  id: string
  title: string
  description?: string
  download_url: string
  thumbnail_url?: string
  category_id: string
  downloads: number
  tags?: string[]
  created_at: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<DatabaseImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [query])

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.results || [])
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) {
      setError('Failed to search images')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  const popularSearches = ['nature', 'business', 'technology', 'food', 'abstract', 'people', 'travel', 'lifestyle']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {query ? `Search Results for "${query}"` : 'Search AI Images'}
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for images... nature, business, abstract"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 text-lg rounded-full text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                />
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            {!query && (
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-gray-600 text-sm mr-3">Popular searches:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching images...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={() => handleSearch(searchQuery)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && results.length === 0 && query && (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
                  <p className="text-gray-600 mb-4">
                    Try different keywords or browse our categories
                  </p>
                  <a 
                    href="/categories"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Categories
                  </a>
                </div>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {results.length} image{results.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((image) => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search Tips */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use specific keywords like "mountain sunset"</li>
                  <li>• Try category names: nature, business, food</li>
                  <li>• Search by style: abstract, minimalist</li>
                  <li>• Use colors: blue, red, colorful</li>
                </ul>
              </div>

              {/* AdSense Ad */}
              <div className="bg-white rounded-lg p-4 text-center border-2 border-dashed border-gray-300">
                <AdSense
                  slot="9876543210"
                  style={{ width: '250px', height: '300px' }}
                />
              </div>

              {/* FluentLane Ad */}
              <FluentLaneAd variant="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 