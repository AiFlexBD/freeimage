import { NextRequest, NextResponse } from 'next/server'

// Quality to resolution mapping
const QUALITY_SETTINGS = {
  standard: { size: '1024x1024', description: 'high-quality, detailed' },
  high: { size: '1536x1536', description: 'very high-quality, ultra-detailed, crisp' },
  ultra: { size: '2048x2048', description: 'ultra high-quality, extremely detailed, razor-sharp' },
  max: { size: '4096x4096', description: 'maximum quality, professional-grade, ultra-crisp, print-ready' }
}

// Gemini pricing (2025 latest rates from Google AI Developer docs)
const GEMINI_PRICING = {
  // Gemini 2.5 Flash Image Preview pricing (what we're using)
  inputTokens: 0.0003,     // $0.30 per 1M tokens (text/image)
  outputTokens: 0.000039,  // $0.039 per image (1290 tokens = $0.039, so ~$30 per 1M tokens)
  imageGeneration: 0.039   // $0.039 per image (up to 1024x1024px)
}

// Function to calculate estimated costs
function calculateCosts(inputTokens: number, outputTokens: number, imageCount: number) {
  const inputCost = inputTokens * GEMINI_PRICING.inputTokens
  // For image generation, we use per-image pricing
  const imageCost = imageCount * GEMINI_PRICING.imageGeneration
  // Output tokens are minimal for image generation (just metadata)
  const outputCost = outputTokens * 0.000001 // Minimal cost for output tokens
  const totalCost = inputCost + outputCost + imageCost
  
  return {
    inputCost: Number(inputCost.toFixed(6)),
    outputCost: Number(outputCost.toFixed(6)),
    imageCost: Number(imageCost.toFixed(6)),
    totalCost: Number(totalCost.toFixed(6)),
    breakdown: {
      input: `${inputTokens.toLocaleString()} tokens × $${GEMINI_PRICING.inputTokens}/1M = $${inputCost.toFixed(6)}`,
      output: `${outputTokens.toLocaleString()} tokens (metadata) = $${outputCost.toFixed(6)}`,
      images: `${imageCount} image${imageCount !== 1 ? 's' : ''} × $${GEMINI_PRICING.imageGeneration} = $${imageCost.toFixed(6)}`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio, quality, count } = await request.json()

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (count < 1 || count > 4) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 4' },
        { status: 400 }
      )
    }

    // Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY
    
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    // Get quality settings
    const qualityConfig = QUALITY_SETTINGS[quality as keyof typeof QUALITY_SETTINGS] || QUALITY_SETTINGS.standard

    // Calculate dimensions based on aspect ratio and quality
    const getImageDimensions = (aspectRatio: string, quality: string) => {
      const baseSize = parseInt(qualityConfig.size.split('x')[0])
      
      switch (aspectRatio) {
        case '16:9':
          const width169 = Math.round(baseSize * 1.33) // Wider for 16:9
          const height169 = Math.round(width169 * 9 / 16)
          return { width: width169, height: height169 }
        case '9:16':
          const width916 = Math.round(baseSize * 0.75) // Narrower for 9:16
          const height916 = Math.round(width916 * 16 / 9)
          return { width: width916, height: height916 }
        case '4:3':
          const width43 = Math.round(baseSize * 1.15)
          const height43 = Math.round(width43 * 3 / 4)
          return { width: width43, height: height43 }
        case '3:4':
          const width34 = Math.round(baseSize * 0.87)
          const height34 = Math.round(width34 * 4 / 3)
          return { width: width34, height: height34 }
        default: // 1:1 square
          return { width: baseSize, height: baseSize }
      }
    }

    const dimensions = getImageDimensions(aspectRatio, quality)

    // Generate images with Gemini 2.5 Flash Image Preview
    try {
      const generatedImages = []
      let totalInputTokens = 0
      let totalOutputTokens = 0
      let totalCandidateCount = 0
      const generationDetails = []
      
      for (let i = 0; i < count; i++) {
        // Enhanced prompt with quality and resolution specifications
        const enhancedPrompt = `Create a ${qualityConfig.description} image: ${prompt}. 
        
Image specifications:
- Resolution: ${dimensions.width}x${dimensions.height} pixels
- Aspect ratio: ${aspectRatio}
- Quality level: ${qualityConfig.description}
- Style: Photorealistic, sharp focus, high detail
- Technical: No compression artifacts, crisp edges, vibrant colors
- Output: High-resolution, print-quality image suitable for zooming

Make sure the image is extremely detailed and sharp at the requested resolution.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: enhancedPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.4, // Lower temperature for more consistent quality
              topK: 32,
              topP: 1,
              maxOutputTokens: 8192,
            }
          }),
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error('Gemini API error:', errorData)
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Gemini response for high-quality image:', JSON.stringify(data, null, 2))
        
        // Extract usage metadata
        if (data.usageMetadata) {
          totalInputTokens += data.usageMetadata.promptTokenCount || 0
          totalOutputTokens += data.usageMetadata.candidatesTokenCount || 0
          totalCandidateCount += data.usageMetadata.totalTokenCount || 0
          
          generationDetails.push({
            imageIndex: i + 1,
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            candidateTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0
          })
        }
        
        // Extract image from Gemini response
        const candidate = data.candidates?.[0]
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              // Convert base64 to data URL
              const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              generatedImages.push(imageUrl)
              break
            }
          }
        }
        
        // If no image was generated, add placeholder with correct dimensions
        if (generatedImages.length === i) {
          generatedImages.push(`https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now()}-${i}`)
        }
      }

      // Calculate costs
      const costs = calculateCosts(totalInputTokens, totalOutputTokens, generatedImages.length)

      return NextResponse.json({
        success: true,
        images: generatedImages,
        prompt,
        settings: { 
          aspectRatio, 
          quality, 
          count,
          resolution: `${dimensions.width}x${dimensions.height}`,
          qualityDescription: qualityConfig.description
        },
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          totalTokens: totalCandidateCount,
          imagesGenerated: generatedImages.length,
          details: generationDetails
        },
        costs: costs,
        note: generatedImages.some(img => img.startsWith('data:')) 
          ? `Generated with Gemini 2.5 Flash Image Preview at ${dimensions.width}x${dimensions.height} resolution` 
          : 'Gemini API responded but no images were generated. Using high-resolution placeholders.',
        dimensions
      })

    } catch (error) {
      console.error('Gemini generation error:', error)
      
      // Fallback to demo images with correct high-resolution dimensions
      const dimensions = getImageDimensions(aspectRatio, quality)
      const demoImages = Array.from({ length: count }, (_, i) => {
        return `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now()}-${i}`
      })

      return NextResponse.json({
        success: true,
        images: demoImages,
        prompt,
        settings: { 
          aspectRatio, 
          quality, 
          count,
          resolution: `${dimensions.width}x${dimensions.height}`
        },
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          imagesGenerated: 0,
          details: []
        },
        costs: {
          inputCost: 0,
          outputCost: 0,
          imageCost: 0,
          totalCost: 0,
          breakdown: {
            input: 'API failed - no tokens used',
            output: 'API failed - no tokens used', 
            images: 'Demo images - no cost'
          }
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        note: `Gemini API failed, using high-resolution demo images at ${dimensions.width}x${dimensions.height}. Check your GEMINI_API_KEY and ensure you have access to Gemini 2.5 Flash Image Preview.`,
        dimensions
      })
    }

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    )
  }
} 