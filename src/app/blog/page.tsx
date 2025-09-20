import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Image Blog - Tips, Guides & Resources',
  description: 'Learn how to use free images effectively, photography tips, design guides, and best practices for image usage.',
  keywords: ['free images', 'photography tips', 'design guides', 'image usage', 'creative resources'],
}

const blogPosts = [
  {
    id: 'how-to-use-free-images',
    title: 'How to Use Free Images Effectively in Your Projects',
    excerpt: 'Learn the best practices for finding, downloading, and using free images in your creative projects.',
    date: '2024-09-20',
    readTime: '5 min read',
    category: 'Tutorials'
  },
  {
    id: 'photography-composition-tips',
    title: '10 Essential Photography Composition Tips',
    excerpt: 'Master the art of photography composition with these proven techniques used by professional photographers.',
    date: '2024-09-19',
    readTime: '7 min read',
    category: 'Photography'
  },
  {
    id: 'image-licensing-guide',
    title: 'Complete Guide to Image Licensing and Copyright',
    excerpt: 'Everything you need to know about image licensing, copyright laws, and how to use images legally.',
    date: '2024-09-18',
    readTime: '8 min read',
    category: 'Legal'
  },
  {
    id: 'design-trends-2024',
    title: 'Top Design Trends for 2024: Visual Inspiration',
    excerpt: 'Discover the latest design trends and how to incorporate them into your projects using free images.',
    date: '2024-09-17',
    readTime: '6 min read',
    category: 'Design'
  },
  {
    id: 'image-optimization-guide',
    title: 'Image Optimization Guide: Speed Up Your Website',
    excerpt: 'Learn how to optimize images for web performance without losing quality.',
    date: '2024-09-16',
    readTime: '4 min read',
    category: 'Technical'
  },
  {
    id: 'color-theory-basics',
    title: 'Color Theory Basics for Better Visual Design',
    excerpt: 'Understand color theory fundamentals and how to create visually appealing designs.',
    date: '2024-09-15',
    readTime: '6 min read',
    category: 'Design'
  },
  {
    id: 'ai-prompt-generation-techniques',
    title: 'Master AI Prompt Generation: Techniques for Better Image Creation',
    excerpt: 'Learn advanced AI prompt engineering techniques to create stunning, professional-quality images with AI tools like DALL-E, Midjourney, and Stable Diffusion.',
    date: '2024-09-20',
    readTime: '12 min read',
    category: 'AI & Technology'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Image Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover tips, tutorials, and resources to help you make the most of free images in your creative projects. 
            From photography techniques to design trends, we cover everything you need to know.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={post.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {post.category}
                  </span>
                </div>
                
                {/* Read Time */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white bg-opacity-90 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                    {post.readTime}
                  </span>
                </div>
                
                {/* Featured Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Article #{index + 1}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.date}
                  </span>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm group-hover:underline transition-colors"
                  >
                    Read Article
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Additional Content Sections */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Free Images?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>High-quality, professional images in multiple resolutions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>100% royalty-free for commercial and personal use</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-generated content with unique, original designs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Regular updates with fresh, trending content</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Easy download with no registration required</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Popular Image Categories
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['Nature', 'Business', 'Technology', 'People', 'Food', 'Travel', 'Abstract', 'Architecture'].map((category) => (
                <Link 
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium text-gray-700"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-blue-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Find Your Perfect Image?
          </h3>
          <p className="text-blue-100 mb-6">
            Browse our extensive collection of free, high-quality images and start your next creative project today.
          </p>
          <Link 
            href="/categories"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    </div>
  )
}
