'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalImages: number
  totalCategories: number
  totalDownloads: number
  aiGeneratedThisMonth: number
  recentImages: Array<{
    id: string
    title: string
    category: string
    downloads: number
    created_at: string
  }>
  categoryStats: Array<{
    name: string
    count: number
    slug: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all required data in parallel
      const [imagesRes, categoriesRes] = await Promise.all([
        fetch('/api/images?limit=1000'), // Get all images for accurate count
        fetch('/api/categories/stats')
      ])

      const imagesData = await imagesRes.json()
      const categoriesData = await categoriesRes.json()
      
      // Calculate stats from the data
      const images = imagesData.images || []
      const totalImages = images.length
      const totalCategories = Object.keys(categoriesData.stats || {}).length
      
      // Calculate total downloads
      const totalDownloads = images.reduce((sum: number, img: any) => sum + (img.downloads || 0), 0)
      
      // Calculate AI generated this month
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const aiGeneratedThisMonth = images.filter((img: any) => {
        const createdAt = new Date(img.created_at)
        return createdAt.getMonth() === currentMonth && 
               createdAt.getFullYear() === currentYear &&
               img.tags?.includes('ai-generated')
      }).length

      // Get recent images (last 10)
      const recentImages = images
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map((img: any) => ({
          id: img.id,
          title: img.title,
          category: img.categories?.name || 'Unknown',
          downloads: img.downloads || 0,
          created_at: img.created_at
        }))

      // Get category stats
      const categoryStats = Object.entries(categoriesData.stats || {})
        .map(([id, count]) => ({
          name: id.charAt(0).toUpperCase() + id.slice(1),
          count: count as number,
          slug: id
        }))
        .sort((a, b) => b.count - a.count)

      setStats({
        totalImages,
        totalCategories,
        totalDownloads,
        aiGeneratedThisMonth,
        recentImages,
        categoryStats
      })

    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your ImageGenFree portal</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Images
            </h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalImages.toLocaleString()}</p>
            <p className="text-sm text-gray-500">AI generated images</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categories
            </h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCategories}</p>
            <p className="text-sm text-gray-500">Active categories</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Downloads
            </h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalDownloads.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total downloads</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Generated
            </h3>
            <p className="text-3xl font-bold text-orange-600">{stats.aiGeneratedThisMonth}</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Images */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Images</h2>
            </div>
            <div className="p-6">
              {stats.recentImages.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentImages.map((image) => (
                    <div key={image.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-medium text-gray-900">{image.title}</h4>
                        <p className="text-sm text-gray-500">{image.category} • {image.downloads} downloads</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images found</p>
              )}
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Category Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.categoryStats.map((category) => (
                  <div key={category.slug} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{category.count}</span>
                      <Link 
                        href={`/category/${category.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/ai-generator"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Generate AI Images</h3>
              <p className="text-blue-100 text-sm">Create new AI-generated images using Gemini</p>
            </Link>
            
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="text-lg font-semibold mb-2">View Live Site</h3>
              <p className="text-green-100 text-sm">Check how the site looks to visitors</p>
            </button>
            
            <button
              onClick={fetchDashboardData}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Refresh Data</h3>
              <p className="text-purple-100 text-sm">Update dashboard statistics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 