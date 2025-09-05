import { NextRequest, NextResponse } from 'next/server'

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

    // Generate images with Gemini 2.5 Flash Image Preview
    try {
      const generatedImages = []
      
      for (let i = 0; i < count; i++) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create an image: ${prompt}. Make it ${quality} quality with ${aspectRatio} aspect ratio.`
              }]
            }]
          }),
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error('Gemini API error:', errorData)
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Gemini response:', JSON.stringify(data, null, 2))
        
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
        
        // If no image was generated, add placeholder
        if (generatedImages.length === i) {
          const width = aspectRatio === '16:9' ? 1920 : aspectRatio === '9:16' ? 1080 : 1024
          const height = aspectRatio === '16:9' ? 1080 : aspectRatio === '9:16' ? 1920 : 1024
          generatedImages.push(`https://picsum.photos/${width}/${height}?random=${Date.now()}-${i}`)
        }
      }

      return NextResponse.json({
        success: true,
        images: generatedImages,
        prompt,
        settings: { aspectRatio, quality, count },
        note: generatedImages.some(img => img.startsWith('data:')) 
          ? 'Generated with Gemini 2.5 Flash Image Preview' 
          : 'Gemini API responded but no images were generated. Using placeholders.'
      })

    } catch (error) {
      console.error('Gemini generation error:', error)
      
      // Fallback to demo images if Gemini fails
      const demoImages = Array.from({ length: count }, (_, i) => {
        const width = aspectRatio === '16:9' ? 1920 : aspectRatio === '9:16' ? 1080 : 1024
        const height = aspectRatio === '16:9' ? 1080 : aspectRatio === '9:16' ? 1920 : 1024
        return `https://picsum.photos/${width}/${height}?random=${Date.now()}-${i}`
      })

      return NextResponse.json({
        success: true,
        images: demoImages,
        prompt,
        settings: { aspectRatio, quality, count },
        error: error instanceof Error ? error.message : 'Unknown error',
        note: 'Gemini API failed, using demo images. Check your GEMINI_API_KEY and ensure you have access to Gemini 2.5 Flash Image Preview.'
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