import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AdSenseInit } from '@/components/AdSense'
import FluentLaneAd from '@/components/FluentLaneAd'
import PerformanceLayout from '@/components/PerformanceLayout'
import PerformanceMonitor from '@/components/PerformanceMonitor'

// Optimize font loading for better LCP
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://imagegenfree.com'),
  title: {
    default: 'Free AI Generated Images - Download Royalty-Free Stock Photos | ImageGenFree',
    template: '%s | ImageGenFree - Free AI Images'
  },
  description: 'Download thousands of high-quality AI generated images for free. Perfect for websites, marketing, social media, and commercial projects. No attribution required, royalty-free stock photos.',
  keywords: [
    'free AI images',
    'AI generated images',
    'royalty free images',
    'commercial use images',
    'free stock photos',
    'AI art',
    'artificial intelligence images',
    'free download images',
    'ImageGenFree',
    'no attribution required',
    'high quality AI images',
    'AI photography',
    'machine learning images',
    'computer generated art',
    'digital art free',
    'AI stock photos',
    'free graphics',
    'commercial license images',
    'business images free',
    'marketing images',
    'social media images',
    'website images',
    'blog images',
    'presentation images',
    'design resources',
    'creative commons alternative'
  ],
  authors: [{ name: 'ImageGenFree' }],
  creator: 'ImageGenFree',
  publisher: 'ImageGenFree',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imagegenfree.com',
    siteName: 'ImageGenFree',
    title: 'Free AI Generated Images - Download Royalty-Free Stock Photos',
    description: 'Download thousands of high-quality AI generated images for free. Perfect for websites, marketing, social media, and commercial projects. No attribution required.',
    images: [
      {
        url: 'https://imagegenfree.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImageGenFree - Free AI Generated Images for Commercial Use',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Generated Images - Download Royalty-Free Stock Photos',
    description: 'Download thousands of high-quality AI generated images for free. Perfect for websites, marketing, social media, and commercial projects.',
    images: ['https://imagegenfree.com/og-image.jpg'],
    creator: '@imagegenfree',
    site: '@imagegenfree',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://imagegenfree.com',
  },
  category: 'technology',
}

// JSON-LD structured data - moved to client component to avoid hydration issues
function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FreeImage',
    description: 'Free AI-generated images for commercial use',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Image Categories',
      itemListElement: [
        { '@type': 'Thing', name: 'Nature Images', url: '/category/nature' },
        { '@type': 'Thing', name: 'Business Images', url: '/category/business' },
        { '@type': 'Thing', name: 'Technology Images', url: '/category/technology' },
        { '@type': 'Thing', name: 'Food Images', url: '/category/food' },
        { '@type': 'Thing', name: 'People Images', url: '/category/people' },
        { '@type': 'Thing', name: 'Abstract Images', url: '/category/abstract' },
        { '@type': 'Thing', name: 'Travel Images', url: '/category/travel' },
        { '@type': 'Thing', name: 'Lifestyle Images', url: '/category/lifestyle' },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      suppressHydrationWarning
    />
  )
}

// Service Worker Registration
function ServiceWorkerRegistration() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  }
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <AdSenseInit />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://dqlxsrxjncpvjjzkgtek.supabase.co" />
        
        {/* Critical resource hints */}
        <link rel="preload" href="/api/images" as="fetch" crossOrigin="anonymous" />
        
        {/* Google AdSense Script - Defer for better performance */}
        <script 
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3416527767689571"
          crossOrigin="anonymous"
        />
        
        <StructuredData />
        <ServiceWorkerRegistration />
      </head>
      <body className={inter.className}>
        <PerformanceLayout>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FluentLaneAd variant="floating" />
          <PerformanceMonitor />
        </PerformanceLayout>
      </body>
    </html>
  )
} 