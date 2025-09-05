import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100 mb-6">
              Simple and transparent - we collect almost nothing
            </p>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h3 className="font-semibold text-green-900 mb-2">No Account Required</h3>
            <p className="text-green-700 text-sm">Download images without registration or login</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">No Personal Data</h3>
            <p className="text-blue-700 text-sm">We don't store names, emails, or personal information</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Instant Access</h3>
            <p className="text-purple-700 text-sm">Browse, search, and download immediately</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* What We Actually Collect */}
          <section className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What We Actually Collect</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-4">❌ We DON'T Collect</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Your name or email address</li>
                  <li>• Account information or passwords</li>
                  <li>• Personal preferences or settings</li>
                  <li>• Payment information (everything is free)</li>
                  <li>• Social media profiles or contacts</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">📈 We Only Collect</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Anonymous download counts (for popularity)</li>
                  <li>• Basic server logs (IP addresses, temporary)</li>
                  <li>• Search terms (to improve results)</li>
                  <li>• Browser type (for compatibility)</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
              <p className="text-green-800 text-sm mb-0">
                <strong>Bottom Line:</strong> You can use our entire platform without giving us any personal information. 
                No registration, no tracking, no data collection beyond basic website analytics.
              </p>
            </div>
          </section>

          {/* Third Party Services - Simplified */}
          <section className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-yellow-900">External Services</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🗄️ Supabase (Image Storage)</h4>
                <p className="text-sm text-gray-700">Stores our AI-generated images. No personal data involved.</p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📢 Google AdSense (Optional)</h4>
                <p className="text-sm text-gray-700">May show ads. You can block them with ad blockers.</p>
              </div>
            </div>
          </section>

          {/* Your Rights - Simplified */}
          <section className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights (Simple Version)</h2>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4">✅ What You Can Do</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Use our site completely anonymously</li>
                <li>• Download images without any registration</li>
                <li>• Use ad blockers if you don't want to see ads</li>
                <li>• Contact us if you have any concerns</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">🤷 What You Can't Do (Because We Don't Have Your Data)</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Request deletion of personal data (we don't have any)</li>
                <li>• Access your account info (no accounts exist)</li>
                <li>• Update your profile (no profiles exist)</li>
                <li>• Opt out of email marketing (we don't have your email)</li>
              </ul>
            </div>
          </section>

          {/* AI-Specific Privacy Notice */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-lg">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-orange-900">AI Privacy Notice</h3>
            </div>
            <div className="bg-white/70 rounded-lg p-6">
              <p className="text-orange-900 font-semibold mb-3">
                Our AI images are completely anonymous and don't use your data.
              </p>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• Images are pre-generated, not created based on your activity</li>
                <li>• No personal information goes to AI services</li>
                <li>• Each download is anonymous</li>
                <li>• No AI training on user data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/terms" 
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Terms of Use →
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