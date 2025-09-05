'use client'

import { useState } from 'react'
import { categories } from '@/data/categories'

export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [quality, setQuality] = useState('standard')
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [selectedImageToSave, setSelectedImageToSave] = useState<string | null>(null)
  const [saveTitle, setSaveTitle] = useState('')
  const [saveDescription, setSaveDescription] = useState('')
  const [saveCategoryId, setSaveCategoryId] = useState('')
  const [saveTags, setSaveTags] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedImages([])
    setApiResponse(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          quality,
          count,
        }),
      })

      const data = await response.json()
      setApiResponse(data) // Store full response for debugging

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images')
      }

      console.log('API Response:', data)
      console.log('Images received:', data.images?.length || 0)
      
      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images)
        console.log('First image starts with:', data.images[0].substring(0, 50))
      } else {
        setError('No images were generated')
      }
      
      if (data.note) {
        console.log('Generation note:', data.note)
      }
      if (data.error) {
        setError(`Warning: ${data.error}`)
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToGallery = (imageData: string, originalPrompt: string) => {
    setSelectedImageToSave(imageData)
    setSaveTitle(`AI Generated: ${originalPrompt.slice(0, 50)}${originalPrompt.length > 50 ? '...' : ''}`)
    setSaveDescription(`AI-generated image created with prompt: "${originalPrompt}"`)
    setSaveTags('ai-generated, gemini')
    setShowSaveModal(true)
  }

  const handleSaveSubmit = async () => {
    if (!selectedImageToSave || !saveTitle || !saveCategoryId) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/ai/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImageToSave,
          prompt: prompt,
          categoryId: saveCategoryId,
          title: saveTitle,
          description: saveDescription,
          tags: saveTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Image saved to gallery successfully!')
        setShowSaveModal(false)
        setSelectedImageToSave(null)
        setSaveTitle('')
        setSaveDescription('')
        setSaveCategoryId('')
        setSaveTags('')
      } else {
        alert('Failed to save image: ' + result.error)
      }
    } catch (error) {
      alert('Error saving image: ' + error)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    setSaving(true)
    try {
      if (imageUrl.startsWith('data:')) {
        // For base64 images, convert to blob and download
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `gemini-generated-image-${Date.now()}-${index + 1}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        window.URL.revokeObjectURL(url)
      } else {
        // For regular URLs
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `generated-image-${Date.now()}-${index + 1}.png`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      alert('Image downloaded successfully!')
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download image')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Image Generator</h1>
          <p className="text-gray-600">Create custom images using Gemini 2.5 Flash Image Preview</p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... (e.g., A beautiful mountain landscape at sunset)"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="4:3">Standard (4:3)</option>
                  <option value="3:4">Portrait (3:4)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High Quality</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Count
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 image</option>
                  <option value={2}>2 images</option>
                  <option value={3}>3 images</option>
                  <option value={4}>4 images</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : `Generate ${count} Image${count > 1 ? 's' : ''}`}
            </button>
          </form>
        </div>

        {/* Debug Info */}
        {apiResponse && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Debug Info</h3>
            <div className="text-yellow-800 text-sm">
              <p><strong>Success:</strong> {apiResponse.success ? 'Yes' : 'No'}</p>
              <p><strong>Images Count:</strong> {apiResponse.images?.length || 0}</p>
              <p><strong>Note:</strong> {apiResponse.note}</p>
              {apiResponse.error && <p><strong>Error:</strong> {apiResponse.error}</p>}
              {apiResponse.images && apiResponse.images[0] && (
                <p><strong>First Image Type:</strong> {
                  apiResponse.images[0].startsWith('data:') ? 'Base64 Data' : 'URL'
                }</p>
              )}
            </div>
          </div>
        )}

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}: ${prompt}`}
                      className="w-full h-64 object-cover"
                      onLoad={() => {
                        console.log(`Image ${index + 1} loaded successfully`)
                      }}
                      onError={(e) => {
                        console.error(`Image ${index + 1} failed to load:`, imageUrl.substring(0, 100))
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const errorDiv = target.nextElementSibling as HTMLElement
                        if (errorDiv) {
                          errorDiv.classList.remove('hidden')
                          errorDiv.classList.add('flex')
                        }
                      }}
                    />
                    <div className="hidden w-full h-64 bg-red-100 border-2 border-red-300 items-center justify-center flex-col">
                      <span className="text-red-600 font-semibold">Failed to load image</span>
                      <span className="text-red-500 text-sm mt-1">Check browser console for details</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Type: {imageUrl.startsWith('data:') ? 'Generated by Gemini' : 'Placeholder'}
                    </p>
                    <div className="space-y-2">
                                              {imageUrl.startsWith('data:') && (
                          <button 
                            onClick={() => handleSaveToGallery(imageUrl, prompt)}
                            disabled={saving}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save to Gallery'}
                          </button>
                        )}
                      <button 
                        onClick={() => handleDownload(imageUrl, index)}
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? 'Processing...' : 'Download Image'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Image to Gallery</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={saveCategoryId}
                    onChange={(e) => setSaveCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={saveTags}
                    onChange={(e) => setSaveTags(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-500 mt-1">e.g., ai-generated, gemini, landscape</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubmit}
                  disabled={!saveTitle.trim() || saving || !saveCategoryId}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save to Gallery'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Make sure you have added your GEMINI_API_KEY to .env.local</li>
            <li>• Be descriptive in your prompts for better results</li>
            <li>• Generated images will include a SynthID watermark</li>
            <li>• <strong>Save to Gallery</strong> - Stores image in database with category</li>
            <li>• <strong>Download</strong> - Downloads image file directly to your device</li>
            <li>• Check browser console (F12) for detailed debugging info</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 