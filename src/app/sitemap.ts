import { MetadataRoute } from 'next'
import { categories } from '@/data/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admin/ai-generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]
  
  // Category pages
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  
  // Image pages - fetch from API
  let imagePages: MetadataRoute.Sitemap = []
  
  try {
    // Fetch images from the API
    const response = await fetch(`${baseUrl}/api/images?limit=200`)
    const data = await response.json()
    
    if (data.success && data.images) {
      imagePages = data.images.map((image: any) => {
        const category = categories.find(c => c.id === image.category_id)
        const titleSlug = image.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        
        return {
          url: `${baseUrl}/image/${category?.slug || 'unknown'}/${titleSlug}`,
          lastModified: new Date(image.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })
    }
  } catch (error) {
    console.error('Error fetching images for sitemap:', error)
  }
  
  return [...staticPages, ...categoryPages, ...imagePages]
} 