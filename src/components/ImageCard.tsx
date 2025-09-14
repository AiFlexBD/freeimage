import Link from 'next/link'
import { categories } from '@/data/categories'
import { getImageProps } from '@/lib/imageUtils'

interface ImageCardProps {
  image: {
    id: string
    title: string
    description?: string
    download_url: string
    thumbnail_url?: string
    category_id: string
    downloads: number
    tags?: string[]
    created_at: string
    categories?: {
      name: string
      slug: string
    }
  }
}

export default function ImageCard({ image }: ImageCardProps) {
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const getImageUrl = () => {
    const category = categories.find(c => c.id === image.category_id)
    const titleSlug = createSlug(image.title)
    
    if (category) {
      return `/image/${category.slug}/${titleSlug}`
    }
    
    // Fallback to old URL structure if category not found
    return `/image/${image.id}`
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Track download first
      const trackResponse = await fetch('/api/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id })
      })
      
      // Download the actual file
      const response = await fetch(image.download_url)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename from title or use default
      const filename = `${image.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`
      link.download = filename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Download error:', err)
      
      // Fallback: still try to track and open in new tab
      try {
        await fetch('/api/images/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: image.id })
        })
      } catch (trackErr) {
        console.error('Download tracking fallback error:', trackErr)
      }
      
      // Fallback download method
      window.open(image.download_url, '_blank')
    }
  }

  const imageUrl = getImageUrl()
  
  // Get optimized image props with robust error handling
  const imageProps = getImageProps(
    image.thumbnail_url || image.download_url,
    'card' // Use card preset for better quality
  )

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={imageUrl}>
        <div className="relative aspect-video overflow-hidden">
          <img
            {...imageProps}
            alt={image.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {image.tags?.includes('ai-generated') && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              AI Generated
            </div>
          )}
          {/* Small download button in top-left corner */}
          <button
            onClick={handleDownload}
            className="absolute top-2 left-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Download image"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </Link>
      
      <div className="p-3 sm:p-4">
        <Link href={imageUrl}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
            {image.title}
          </h3>
        </Link>
        
        {image.description && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {image.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {image.categories && (
              <Link 
                href={`/category/${image.categories.slug}`}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium truncate"
              >
                {image.categories.name}
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-1 text-gray-500 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">{image.downloads}</span>
              <span className="sm:hidden">{image.downloads > 999 ? `${Math.floor(image.downloads / 1000)}k` : image.downloads}</span>
            </div>
            
            {/* Small text download link */}
            <button
              onClick={handleDownload}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 