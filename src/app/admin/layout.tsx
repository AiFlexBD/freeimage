'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    // Add a small delay to prevent hydration issues
    const timer = setTimeout(() => {
      checkAuthStatus()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setError('Authentication error')
        redirectToLogin()
        return
      }
      
      if (session) {
        await checkUserRole(session.user.id, session.user.email || '')
      } else {
        // No session, redirect to login
        redirectToLogin()
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setError('Failed to verify authentication')
      redirectToLogin()
    }
  }

  const checkUserRole = async (userId: string, email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('No active session')
        redirectToLogin()
        return
      }

      // Check role from JWT token's user_metadata instead of database
      const userRole = session.user.user_metadata?.role
      
      if (userRole !== 'admin') {
        setError('Access denied. Admin privileges required.')
        await supabase.auth.signOut()
        redirectToLogin()
        return
      }

      // User is admin
      setIsAuthenticated(true)
      setUserEmail(email)
      setError('')
    } catch (err) {
      console.error('Role check error:', err)
      setError('Failed to verify admin role')
      await supabase.auth.signOut()
      redirectToLogin()
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToLogin = () => {
    setIsLoading(false)
    // Use setTimeout to prevent immediate redirect issues
    setTimeout(() => {
      router.push('/admin/login')
    }, 100)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Access Error</strong>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Authentication Required</strong>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ImageGenFree Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/admin"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Dashboard
            </a>
            <a
              href="/admin/ai-generator"
              className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              AI Generator
            </a>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 