'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { categories } from '@/data/categories'

interface UploadedImage {
  id: string
  title: string
  description?: string
  download_url: string
  thumbnail_url?: string
  category_id: string
  tags: string[]
  width?: number
  height?: number
  downloads: number
  created_at: string
  categories?: {
    name: string
    slug: string
  }
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadCategory, setUploadCategory] = useState('')
  const [uploadTags, setUploadTags] = useState('')
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/images?limit=100')
      const data = await response.json()
      
      if (data.success) {
        setImages(data.images || [])
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadFile || !uploadTitle || !uploadCategory) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)

      // Generate unique filename
      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `manual-uploads/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, uploadFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      // Get image dimensions
      const img = new Image()
      img.src = uploadPreview!
      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Save to database
      const imageData = {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        title: uploadTitle,
        description: uploadDescription,
        filename: fileName,
        category_id: uploadCategory,
        tags: uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        width: img.width,
        height: img.height,
        file_size: uploadFile.size,
        download_url: publicUrl,
        thumbnail_url: publicUrl,
        downloads: 0,
        is_featured: false
      }

      const { error: dbError } = await supabase
        .from('images')
        .insert([imageData])

      if (dbError) {
        throw dbError
      }

      // Reset form
      setUploadFile(null)
      setUploadTitle('')
      setUploadDescription('')
      setUploadCategory('')
      setUploadTags('')
      setUploadPreview(null)
      setShowUploadModal(false)

      // Refresh images list
      fetchImages()

      alert('Image uploaded successfully!')

    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId: string, downloadUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (dbError) {
        throw dbError
      }

      // Extract file path from URL and delete from storage
      const urlParts = downloadUrl.split('/')
      const filePath = urlParts.slice(-2).join('/') // Get last two parts (folder/filename)
      
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([filePath])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
      }

      // Refresh images list
      fetchImages()

      alert('Image deleted successfully!')

    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete image. Please try again.')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
            <p className="text-gray-600">Upload and manage your image collection</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload New Image
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Images</h3>
            <p className="text-3xl font-bold text-blue-600">{images.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-3xl font-bold text-green-600">{categories.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Downloads</h3>
            <p className="text-3xl font-bold text-purple-600">
              {images.reduce((sum, img) => sum + img.downloads, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-orange-600">
              {images.filter(img => {
                const created = new Date(img.created_at)
                const now = new Date()
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
              }).length}
            </p>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Images</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={image.thumbnail_url || image.download_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDeleteImage(image.id, image.download_url)}
                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{image.categories?.name || image.category_id}</p>
                      <p className="text-sm text-gray-500">{image.downloads} downloads</p>
                      {image.tags && image.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {image.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{image.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {images.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No images found. Upload your first image!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Upload New Image</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleUpload} className="p-6">
                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image File *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  {uploadPreview && (
                    <div className="mt-4">
                      <img src={uploadPreview} alt="Preview" className="max-w-full h-48 object-cover rounded" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image description"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate tags with commas (e.g., landscape, nature, sunset)</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 