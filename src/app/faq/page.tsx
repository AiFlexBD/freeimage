import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - ImageGenFree | Frequently Asked Questions',
  description: 'Find answers to common questions about ImageGenFree, our AI-generated images, licensing, and how to use our platform.',
  keywords: 'FAQ, frequently asked questions, help, support, AI images, licensing',
  openGraph: {
    title: 'FAQ - ImageGenFree',
    description: 'Get answers to common questions about our AI-generated images and platform.',
    type: 'website',
  },
}

export default function FAQPage() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is ImageGenFree?",
          answer: "ImageGenFree is a platform that provides high-quality AI-generated images completely free for any use. We use advanced AI technology to create unique images across various categories including nature, business, abstract art, and more."
        },
        {
          question: "How do I download images?",
          answer: "Simply browse our categories or search for specific images, click on any image you like, and use the download button. No registration, login, or payment required."
        },
        {
          question: "Do I need to create an account?",
          answer: "No! ImageGenFree is completely free to use without any registration. You can browse, download, and use our images immediately without creating an account."
        },
        {
          question: "How often do you add new images?",
          answer: "We continuously add new AI-generated images to our library. New images are added daily across all categories to keep our collection fresh and diverse."
        }
      ]
    },
    {
      category: "Usage & Licensing",
      questions: [
        {
          question: "Can I use these images commercially?",
          answer: "Yes! All images on ImageGenFree are free for commercial use. You can use them in client projects, marketing materials, websites, products, and any other commercial purpose without restrictions."
        },
        {
          question: "Do I need to give attribution?",
          answer: "No attribution is required, but we always appreciate it when you credit ImageGenFree. You can use our images without any attribution requirements."
        },
        {
          question: "Are there any usage restrictions?",
          answer: "The only restriction is that you cannot resell or redistribute the images as standalone products. You can use them in your projects, but you cannot sell the images themselves."
        },
        {
          question: "Can I modify the images?",
          answer: "Absolutely! You can edit, crop, resize, or modify our images in any way you need for your projects. The images are yours to use and customize as needed."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          question: "What image formats do you provide?",
          answer: "We provide high-quality images in standard formats. Most images are available in high resolution suitable for both web and print use."
        },
        {
          question: "What are the image dimensions?",
          answer: "Our images come in various dimensions, typically ranging from 1024x1024 pixels to higher resolutions. Each image is optimized for quality while maintaining reasonable file sizes."
        },
        {
          question: "How do you generate these images?",
          answer: "We use advanced AI image generation technology to create unique, high-quality images. Our AI models are trained to produce diverse, professional-quality content across multiple categories."
        },
        {
          question: "Are the images really unique?",
          answer: "Yes! Each image is generated uniquely by our AI system. While there might be similar themes or styles, each image is a unique creation that doesn't exist elsewhere."
        }
      ]
    },
    {
      category: "Categories & Content",
      questions: [
        {
          question: "What categories of images do you offer?",
          answer: "We offer a wide variety of categories including nature, business, abstract art, space, medieval themes, pixel art, music, oil paintings, and many more. Our collection continues to grow with new categories regularly."
        },
        {
          question: "Can I request specific types of images?",
          answer: "While we don't take custom requests, we continuously expand our categories based on user feedback and popular demand. Feel free to contact us with suggestions for new categories."
        },
        {
          question: "How do I find specific types of images?",
          answer: "You can browse by category, use our search function, or explore our featured collections. Each category page shows all available images in that style or theme."
        },
        {
          question: "Do you have seasonal or trending content?",
          answer: "Yes! We regularly add seasonal content and trending themes to keep our collection current and relevant for various projects and occasions."
        }
      ]
    },
    {
      category: "Support & Contact",
      questions: [
        {
          question: "How can I contact support?",
          answer: "You can reach us at support@imagegenfree.com for any questions, feedback, or technical issues. We typically respond within 24-48 hours."
        },
        {
          question: "Do you offer technical support?",
          answer: "Yes! If you're having trouble downloading images or using our platform, our support team is here to help. Contact us and we'll assist you promptly."
        },
        {
          question: "Can I report issues with images?",
          answer: "Absolutely! If you encounter any issues with image quality, download problems, or other technical issues, please contact us with details so we can investigate and resolve the problem."
        },
        {
          question: "Do you accept feedback and suggestions?",
          answer: "We love hearing from our users! Your feedback helps us improve our platform and add new features. Send us your suggestions at support@imagegenfree.com."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about ImageGenFree, our AI-generated images, 
            and how to make the most of our platform.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Can't find what you're looking for?</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQ..."
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Still need help? <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">Contact us directly</a>
            </p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">{category.category}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Still Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get personalized help from our support team
              </p>
              <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact Us →
              </a>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Read Our Blog</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tips, tutorials, and guides for using AI images
              </p>
              <a href="/blog" className="text-green-600 hover:text-green-800 font-medium">
                Visit Blog →
              </a>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Images</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore our collection of AI-generated images
              </p>
              <a href="/categories" className="text-purple-600 hover:text-purple-800 font-medium">
                View Categories →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
