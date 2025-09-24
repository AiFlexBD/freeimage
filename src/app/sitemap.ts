import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imagegenfree.com'
  
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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Category pages
  const categories = [
    'nature', 'business', 'technology', 'food', 'people', 'abstract', 
    'travel', 'lifestyle', 'anime', 'space', 'pixel-art', 'aesthetic',
    'lofi-music', 'product', 'oil-painted', 'music', 'medieval'
  ]

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Blog pages
  const blogPosts = [
    'how-to-use-free-images',
    'image-optimization-guide',
    'photography-composition-tips',
    'image-licensing-guide',
    'design-trends-2024',
    'color-theory-basics'
  ]

  const blogPages = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...blogPages]
}