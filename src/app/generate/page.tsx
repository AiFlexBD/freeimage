'use client'

import { useState } from 'react'

interface GeneratedImage {
  url: string
  originalPrompt: string
  enhancedPrompt: string
  revisedPrompt: string
  size: string
  quality: string
  style: string
  category: string
  generated_at: string
}

interface GenerationBenefits {
  promptEnhancement: string
  qualityOptimization: string
  categoryDetection: string
  multipleVariations: string
  commercialReady: string
  instantSave: string
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [quality, setQuality] = useState('standard')
  const [style, setStyle] = useState('vivid')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [benefits, setBenefits] = useState<GenerationBenefits | null>(null)
  const [error, setError] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  const qualityOptions = [
    { value: 'standard', label: 'Standard (1024×1024)', description: 'High-quality, fast generation' },
    { value: 'hd', label: 'HD Portrait (1024×1792)', description: 'Ultra HD, professional-grade' },
    { value: 'landscape', label: 'HD Landscape (1792×1024)', description: 'Perfect for wide scenes' },
    { value: 'square_hd', label: 'HD Square (1024×1024)', description: 'HD quality, vivid colors' }
  ]

  const styleOptions = [
    { value: 'vivid', label: 'Vivid', description: 'Vibrant colors, dramatic lighting' },
    { value: 'natural', label: 'Natural', description: 'Realistic, authentic appearance' }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your image')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)
    setBenefits(null)

    try {
      const response = await fetch('/api/azure-ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          quality,
          style
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedImage(data.image)
        setBenefits(data.benefits)
      } else {
        setError(data.error || 'Failed to generate image')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    // Create filename based on prompt and timestamp
    const filename = `imagegenfree-${generatedImage.category}-${Date.now()}.png`
    
    // Create download link and trigger download
    const link = document.createElement('a')
    link.href = generatedImage.url
    link.download = filename
    link.click()
  }

  const shareText = generatedImage 
    ? `🎨 Check out this amazing AI-generated image I created with ImageGenFree! 

"${generatedImage.originalPrompt}"

✨ Enhanced with professional photography terms
🎯 Multiple variations for best quality  
💎 Commercial-ready, high-resolution
🆓 Completely FREE to use!

Create your own stunning images at: https://imagegenfree.com

#AIArt #ImageGenFree #FreeImages #AIGenerated #DigitalArt`
    : ''

  const handleShare = (platform: string) => {
    if (!generatedImage) return

    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent('https://imagegenfree.com')
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}&media=${encodeURIComponent(generatedImage.url)}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent('Amazing AI-generated image from ImageGenFree')}`,
      whatsapp: `https://wa.me/?text=${encodedText}`
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
  }

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      alert('Share text copied to clipboard! 📋')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Powered by Azure DALL-E 3 with Enhanced Features
          </p>
          
          {/* Benefits Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Prompt Enhancement</h3>
              <p className="text-sm text-gray-600">Your prompts are automatically enhanced with professional photography terms and category-specific improvements</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Variations</h3>
              <p className="text-sm text-gray-600">We generate multiple variations and select the best result automatically, giving you higher quality images</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Share & Download</h3>
              <p className="text-sm text-gray-600">One-click download and social sharing with built-in promotion for ImageGenFree</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Generation Form */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Image</h2>
            
            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A professional business meeting in a modern office with natural lighting"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={isGenerating}
              />
            </div>

            {/* Quality Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quality & Size
              </label>
              <div className="grid grid-cols-1 gap-3">
                {qualityOptions.map((option) => (
                  <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value={option.value}
                      checked={quality === option.value}
                      onChange={(e) => setQuality(e.target.value)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styleOptions.map((option) => (
                  <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value={option.value}
                      checked={style === option.value}
                      onChange={(e) => setStyle(e.target.value)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating with Azure DALL-E 3...
                </>
              ) : (
                '🎨 Generate Free Image'
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {generatedImage ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Generated Image</h2>
                
                {/* Image Display */}
                <div className="mb-6">
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.originalPrompt}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                {/* Benefits Display */}
                {benefits && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">✨ ImageGenFree Benefits Applied:</h3>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• {benefits.promptEnhancement}</li>
                      <li>• {benefits.qualityOptimization}</li>
                      <li>• {benefits.categoryDetection}</li>
                      <li>• {benefits.multipleVariations}</li>
                      <li>• {benefits.commercialReady}</li>
                    </ul>
                  </div>
                )}

                {/* Image Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Image Details:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Size:</strong> {generatedImage.size}</p>
                    <p><strong>Quality:</strong> {generatedImage.quality}</p>
                    <p><strong>Style:</strong> {generatedImage.style}</p>
                    <p><strong>Category:</strong> {generatedImage.category}</p>
                    <p><strong>Model:</strong> Azure DALL-E 3</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    📥 Download Image
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    🚀 Share & Promote
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create</h3>
                <p className="text-gray-600">Enter your prompt and generate a stunning AI image with enhanced features</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose ImageGenFree Over Direct DALL-E?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Enhancement</h3>
              <p className="text-sm text-gray-600">Automatic prompt optimization with professional photography terms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Download</h3>
              <p className="text-sm text-gray-600">One-click download with optimized filename and format</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1H6V4a1 1 0 011-1m0 0h10M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8M7 8H5a2 2 0 00-2 2v8a2 2 0 002 2h2M7 8h10m0 0h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Variations</h3>
              <p className="text-sm text-gray-600">Best result selected from multiple generated variations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Social Sharing</h3>
              <p className="text-sm text-gray-600">Built-in promotion tools to share your creations and promote ImageGenFree</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && generatedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Share Your Creation</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.originalPrompt}
                  className="w-full rounded-lg shadow-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Text (with ImageGenFree promotion):
                </label>
                <textarea
                  value={shareText}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm h-32"
                />
                <button
                  onClick={copyShareText}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  📋 Copy to Clipboard
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🐦 Twitter
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  💼 LinkedIn
                </button>
                <button
                  onClick={() => handleShare('pinterest')}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  📌 Pinterest
                </button>
                <button
                  onClick={() => handleShare('reddit')}
                  className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🔴 Reddit
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 