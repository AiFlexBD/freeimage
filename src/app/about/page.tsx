import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - ImageGenFree | AI-Generated Free Images',
  description: 'Learn about ImageGenFree, the leading platform for high-quality AI-generated images. Our mission to provide free, commercial-use images for creators worldwide.',
  keywords: 'about us, AI images, free images, image generation, team, mission',
  openGraph: {
    title: 'About Us - ImageGenFree',
    description: 'Learn about our mission to provide free AI-generated images for creators worldwide.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">ImageGenFree</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way creators access high-quality images by providing 
            unlimited AI-generated content that's completely free for commercial use.
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At ImageGenFree, we believe that creativity shouldn't be limited by budget constraints. 
            Our mission is to democratize access to high-quality visual content by providing 
            unlimited AI-generated images that creators can use freely for any purpose.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-700 font-medium">Free Forever</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-gray-700 font-medium">Unlimited Downloads</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">✓</div>
              <div className="text-gray-700 font-medium">Commercial Use</div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🤖 AI-Powered Generation</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cutting-edge AI technology to generate high-quality images across 
                multiple categories including nature, business, abstract art, and more. 
                Each image is unique and created specifically for our platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎨 Diverse Categories</h3>
              <p className="text-gray-700 leading-relaxed">
                From pixel art to oil paintings, space themes to medieval scenes, 
                we offer a wide variety of styles and categories to meet every 
                creative need and project requirement.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📱 Easy Access</h3>
              <p className="text-gray-700 leading-relaxed">
                No registration required, no watermarks, no attribution needed. 
                Simply browse, download, and use our images in your projects 
                immediately without any restrictions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Always Growing</h3>
              <p className="text-gray-700 leading-relaxed">
                Our library is constantly expanding with new images added daily. 
                We continuously improve our AI models to provide even better 
                quality and more diverse content.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ImageGenFree?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">✅ No Hidden Costs</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Unlike other platforms that charge per download or require subscriptions, 
                we provide unlimited access to our entire library completely free.
              </p>
              <h3 className="text-xl font-semibold mb-4">✅ Commercial Rights</h3>
              <p className="text-blue-100 leading-relaxed">
                Use our images in commercial projects, client work, marketing materials, 
                and any other purpose without worrying about licensing fees or restrictions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">✅ High Quality</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Our AI generates high-resolution images suitable for both web and print use, 
                ensuring your projects look professional and polished.
              </p>
              <h3 className="text-xl font-semibold mb-4">✅ No Attribution</h3>
              <p className="text-blue-100 leading-relaxed">
                While we appreciate credit, it's not required. Use our images without 
                any attribution requirements, making your workflow faster and cleaner.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                We're open about our AI technology and how we generate images, 
                ensuring you understand exactly what you're getting.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">
                Everyone deserves access to quality visual content, regardless of 
                their budget or project size.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                We continuously improve our AI technology to provide better quality 
                and more diverse content for our users.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using ImageGenFree to bring 
            their projects to life with high-quality AI-generated images.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Images
            </Link>
            <Link
              href="/blog"
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Read Our Blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
