# FreeImage Portal

AI-Powered Stock Photo Website built with Next.js, TypeScript, and Supabase.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and add your credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database:**
   - Create a Supabase project
   - Run the SQL from `supabase-schema.sql` in your Supabase SQL editor

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Visit your site:**
   Open http://localhost:3000

## 🌟 Features

- **🏠 Homepage** - Hero section with categories and featured images
- **📁 Categories** - 8 categories (Nature, Business, Technology, etc.)
- **🔍 Search** - Real-time search with category filtering
- **🖼️ Image Details** - Individual image pages with download
- **👨‍💼 Admin Panel** - Complete admin dashboard
- **🤖 AI Generator** - Create images using Gemini AI
- **💰 AdSense** - Monetization ready
- **📱 Responsive** - Mobile-first design

## 🔗 Pages

- **Homepage:** `/`
- **Categories:** `/categories`
- **Category Page:** `/category/nature` (or any category slug)
- **Image Detail:** `/image/nature-1` (or any image ID)
- **Search:** `/search`
- **Admin Login:** `/admin/login`
- **Admin Dashboard:** `/admin`
- **AI Generator:** `/admin/ai-generator`

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the SQL schema from `supabase-schema.sql`
4. Update your `.env.local` file

## 🤖 AI Integration

The AI generator uses Gemini 2.5 Flash Image Preview for image generation:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/)
2. Add it to your `.env.local`:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

## 💰 AdSense Integration

Google AdSense is integrated for monetization:

1. **Setup AdSense Account:** Get approved at [Google AdSense](https://www.google.com/adsense/)
2. **Configure Environment:**
   ```env
   NEXT_PUBLIC_ADSENSE_ENABLED=true
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-your-publisher-id
   ```
3. **Development Mode:** Shows placeholders with your ad slot info
4. **Production Mode:** Displays real ads when deployed

**Current Publisher ID:** `ca-pub-3416527767689571` ✅

## 💡 Development

- Built with Next.js 14.2.5 and TypeScript
- Styled with Tailwind CSS
- Database with Supabase
- Authentication with Supabase Auth

## 🚀 Deployment

Ready to deploy to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

---

**Your FreeImage Portal is ready to use!** 🎉 