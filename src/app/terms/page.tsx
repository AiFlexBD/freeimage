import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
            <p className="text-xl text-blue-100 mb-6">
              Simple rules for using our free AI images
            </p>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Navigation */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <a href="#acceptance" className="text-blue-600 hover:text-blue-800 hover:underline">Acceptance</a>
            <a href="#service" className="text-blue-600 hover:text-blue-800 hover:underline">Service Description</a>
            <a href="#license" className="text-blue-600 hover:text-blue-800 hover:underline">License & Usage</a>
            <a href="#restrictions" className="text-blue-600 hover:text-blue-800 hover:underline">Restrictions</a>
            <a href="#ai-disclaimer" className="text-blue-600 hover:text-blue-800 hover:underline">AI Disclaimer</a>
            <a href="#liability" className="text-blue-600 hover:text-blue-800 hover:underline">Liability</a>
            <a href="#termination" className="text-blue-600 hover:text-blue-800 hover:underline">Termination</a>
            <a href="#contact" className="text-blue-600 hover:text-blue-800 hover:underline">Contact</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section id="acceptance" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                By accessing or using FreeImage ("the Service"), you agree to be bound by these Terms of Use. 
                If you do not agree to these terms, please do not use our service.
              </p>
              <p>
                These terms constitute a legally binding agreement between you and FreeImage regarding your use 
                of our AI-generated image platform.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="service" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                FreeImage provides a platform for accessing and downloading AI-generated images. Our service includes:
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✅ What We Provide</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• High-quality AI-generated images</li>
                    <li>• Multiple categories and styles</li>
                    <li>• Free download access</li>
                    <li>• Commercial use licensing</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• All images are AI-generated</li>
                    <li>• No human photographers involved</li>
                    <li>• Quality may vary</li>
                    <li>• Service availability not guaranteed</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* AI Disclaimer - Highlighted */}
          <section id="ai-disclaimer" className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-orange-900">AI-Generated Content Disclaimer</h2>
            </div>
            <div className="prose prose-lg max-w-none text-orange-900">
              <div className="bg-white/70 rounded-lg p-6">
                <p className="font-semibold mb-4">IMPORTANT: All images on this platform are generated by artificial intelligence.</p>
                <ul className="space-y-2">
                  <li>• <strong>No Real People:</strong> AI may create realistic-looking people who do not exist</li>
                  <li>• <strong>No Real Places:</strong> Locations may be fictional or composites</li>
                  <li>• <strong>Potential Biases:</strong> AI models may reflect training data biases</li>
                  <li>• <strong>Quality Variations:</strong> Images may contain artifacts or inconsistencies</li>
                  <li>• <strong>Legal Compliance:</strong> You are responsible for ensuring appropriate use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="license" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">License and Usage Rights</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h4 className="text-green-900 font-semibold mb-3">✅ You MAY Use Images For:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                  <ul className="space-y-1">
                    <li>• Personal projects</li>
                    <li>• Commercial projects</li>
                    <li>• Marketing materials</li>
                    <li>• Website content</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Social media posts</li>
                    <li>• Print materials</li>
                    <li>• Digital products</li>
                    <li>• Educational content</li>
                  </ul>
                </div>
              </div>
              <p>
                We grant you a non-exclusive, worldwide, royalty-free license to use, modify, and distribute 
                the images for both personal and commercial purposes.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="restrictions" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Restrictions</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-red-900 font-semibold mb-3">❌ You MAY NOT:</h4>
                <ul className="text-sm text-red-800 space-y-2">
                  <li>• Claim ownership or copyright of the images</li>
                  <li>• Resell images as standalone products</li>
                  <li>• Use images for illegal or harmful purposes</li>
                  <li>• Create competing image platforms using our content</li>
                  <li>• Use images to train other AI models without permission</li>
                  <li>• Reverse engineer our AI generation process</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Additional Sections - Simplified */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🛡️ Disclaimers</h3>
              <p className="text-gray-700 text-sm">
                Images are provided "as is" without warranties. We do not guarantee accuracy, 
                quality, or fitness for any particular purpose.
              </p>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚖️ Liability Limits</h3>
              <p className="text-gray-700 text-sm">
                Our liability is limited to the maximum extent permitted by law. 
                We are not responsible for any damages arising from image use.
              </p>
            </section>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Privacy Policy →
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 