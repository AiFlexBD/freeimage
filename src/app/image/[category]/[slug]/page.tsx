import { Metadata } from 'next'
import { categories } from '@/data/categories'
import ImagePageClient from './ImagePageClient'

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
  width?: number
  height?: number
  file_size?: number
  slug?: string
  categories?: {
    name: string
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    // Use the new efficient API endpoint
    const response = await fetch(`${baseUrl}/api/images/by-slug?category=${params.category}&slug=${params.slug}`, { cache: 'no-store' })
    const data = await response.json()
    
    if (data.success && data.image) {
      const foundImage = data.image
      const category = categories.find(c => c.id === foundImage.category_id)
      const title = `${foundImage.title} - Free ${category?.name} Image Download`
      const description = `Download ${foundImage.title.toLowerCase()} for free. High-quality ${category?.name.toLowerCase()} image perfect for commercial and personal use. AI-generated, royalty-free.`
      
      return {
        title,
        description,
        keywords: [
          foundImage.title.toLowerCase(),
          `${category?.name.toLowerCase()} images`,
          'free download',
          'AI generated',
          'royalty free',
          'commercial use',
          'high resolution',
          ...(foundImage.tags || [])
        ],
        openGraph: {
          title,
          description,
          type: 'website',
          url: `${baseUrl}/image/${params.category}/${params.slug}`,
          images: [
            {
              url: foundImage.download_url,
              width: foundImage.width || 1024,
              height: foundImage.height || 1024,
              alt: foundImage.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [foundImage.download_url],
        },
        alternates: {
          canonical: `/image/${params.category}/${params.slug}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  const categoryName = categories.find(c => c.slug === params.category)?.name || 'Image'
  const title = `${params.slug.replace(/-/g, ' ')} - Free ${categoryName} Image`
  
  return {
    title,
    description: `Download this beautiful ${categoryName.toLowerCase()} image for free. High-quality, AI-generated, perfect for commercial and personal use.`,
  }
}

export default function ImagePage({ params }: { params: { category: string; slug: string } }) {
  return <ImagePageClient params={params} />
} 