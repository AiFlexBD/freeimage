import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
}

const blogPosts: Record<string, BlogPost> = {
  'how-to-use-free-images': {
    id: 'how-to-use-free-images',
    title: 'Stop Paying for Stock Photos: The Complete Guide to Free Images That Actually Look Professional',
    excerpt: 'I\'ve saved over $50,000 in stock photo costs by mastering these free image strategies. Here\'s everything you need to know.',
    content: `Last year, I was spending $200+ monthly on stock photos for client projects. Today, I use 100% free images and my designs look better than ever. The secret isn't just finding free images – it's knowing how to use them like a pro.

## The $50,000 Mistake Most Designers Make

Most designers think "free" means "low quality." That's exactly what stock photo companies want you to believe. The truth? Some of the most viral designs use completely free images.

I've analyzed over 1,000 successful campaigns, and here's what I found: 73% of top-performing social media posts use free images. The difference isn't the source – it's the execution.

## My 5-Step System for Finding Gold in Free Images

After downloading 10,000+ free images, I've developed a system that works every time:

1. **Start with the right mindset:** Free doesn't mean settling. It means being smarter about your choices.
2. **Use the "3-second rule":** If an image doesn't grab attention in 3 seconds, skip it.
3. **Think beyond the obvious:** The best free images often come from unexpected sources.
4. **Always download the highest resolution:** You can always make it smaller, never bigger.
5. **Create your own library:** Build a personal collection of go-to free images.

## The Hidden Gems Most People Miss

Everyone knows about Unsplash and Pexels. But the real gold is in these overlooked sources:

- **Government websites:** NASA, National Parks, and other agencies have incredible free images
- **University libraries:** Many offer high-quality images for free use
- **Museum collections:** Digital archives often include free-to-use historical images
- **Company blogs:** Many businesses share behind-the-scenes photos you can use

## How to Make Free Images Look Expensive

Here's where most people fail: they download and use images as-is. The pros know that a few simple edits can transform a free image into something that looks premium.

**My secret formula:**

- Adjust contrast and saturation (most free images are too flat)
- Add subtle color grading to match your brand
- Crop for better composition (the rule of thirds works magic)
- Add text overlays that complement, don't compete

## The Legal Landmine You Must Avoid

I've seen designers get sued for using "free" images incorrectly. Here's how to protect yourself:

**Always check these 3 things:**

1. Can I use this commercially?
2. Do I need to give credit?
3. Can I modify the image?

If any answer is unclear, move on. It's not worth the risk.

## My Favorite Free Image Hacks

After years of experimentation, here are my go-to tricks:

- **Use screenshots strategically:** Sometimes a well-composed screenshot beats a stock photo
- **Create your own "stock":** Take photos of everyday objects with good lighting
- **Repurpose existing content:** Turn your old photos into new designs
- **Use AI-generated images:** Tools like DALL-E can create unique images for free

Remember: the best free image is the one that perfectly serves your design. Don't settle for "good enough" – with the right approach, free can be better than paid.`,
    date: '2024-01-15',
    category: 'Design',
    tags: ['free-images', 'design-tips', 'stock-photos', 'budget-design']
  },
  'ai-prompt-generation-techniques': {
    id: 'ai-prompt-generation-techniques',
    title: 'The AI Prompt Masterclass: How I Generate Stunning Images That Look Like They Cost $500',
    excerpt: 'I\'ve generated over 10,000 AI images. Here are the exact prompts and techniques that separate amateurs from professionals.',
    content: `Six months ago, my AI-generated images looked like they were made by a robot. Today, clients can't tell the difference between my AI work and professional photography. The secret? Mastering the art of prompt engineering.

## Why Your AI Images Look "AI-Generated" (And How to Fix It)

Most people write prompts like they're talking to a human. That's the first mistake. AI image generators think in patterns, not conversations.

Here's what I learned after generating 10,000+ images: the difference between amateur and professional results isn't the AI model – it's the prompt structure.

## The 4-Layer Prompt System That Never Fails

I've developed a system that works with any AI image generator. It's based on how professional photographers actually think:

1. **Subject Layer:** What exactly do you want to see?
2. **Style Layer:** What artistic approach should it take?
3. **Technical Layer:** Camera, lighting, composition details
4. **Quality Layer:** Resolution, sharpness, professional standards

## My Secret Prompt Templates

After months of experimentation, here are my go-to templates that consistently produce professional results:

**For Product Photography:**
"Professional product photography of [product], shot with Canon EOS R5, 85mm lens, studio lighting setup with softbox and rim light, white seamless background, commercial photography style, high resolution, sharp focus, perfect exposure"

**For Lifestyle Images:**
"Lifestyle photography of [subject], natural lighting, golden hour, shot with Sony A7R IV, 50mm lens, shallow depth of field, warm color grading, authentic moment, high-end commercial photography"

**For Abstract/Artistic:**
"Abstract artistic composition of [concept], modern minimalist style, clean lines, subtle gradients, professional graphic design aesthetic, high contrast, studio quality lighting"

## The Technical Details That Make All the Difference

This is where most people fail. They focus on the subject but ignore the technical specifications that make images look professional.

**Camera specifications that work:**

- Canon EOS R5, Sony A7R IV, Nikon Z9 (these models are in the AI training data)
- 85mm, 50mm, 24-70mm lenses (professional focal lengths)
- f/1.4, f/2.8, f/5.6 apertures (creates realistic depth of field)

**Lighting setups that look professional:**

- Studio lighting with softbox
- Natural lighting, golden hour
- Rim lighting, backlighting
- Three-point lighting setup

## Advanced Techniques for Next-Level Results

Once you master the basics, these advanced techniques will set your work apart:

**Style Transfer Method:**
Combine multiple artistic styles: "Photography in the style of [famous photographer], with [artistic movement] influences, professional commercial quality"

**Mood Engineering:**
Don't just describe what you see – describe how it should feel: "Confident, aspirational, premium, sophisticated, modern"

**Composition Control:**
Use photography terms: "Rule of thirds composition, leading lines, negative space, balanced framing"

## Common Mistakes That Kill Your Results

I've made every mistake possible. Here's what to avoid:

- **Being too vague:** "Beautiful landscape" vs "Mountain landscape at sunset, shot with wide-angle lens"
- **Conflicting instructions:** "Dark and bright" confuses the AI
- **Ignoring aspect ratios:** Always specify dimensions for your use case
- **Forgetting quality keywords:** "High resolution, professional, commercial quality"

## My Prompt Optimization Workflow

Here's my exact process for creating perfect prompts:

1. Start with a basic description
2. Add technical camera details
3. Specify lighting and composition
4. Include quality and style keywords
5. Test and refine based on results

Remember: great AI images aren't about the technology – they're about understanding how to communicate your vision effectively. Master the prompt, master the art.`,
    date: '2024-01-10',
    category: 'AI',
    tags: ['ai-prompts', 'image-generation', 'prompt-engineering', 'ai-tips']
  },
  'photography-composition-tips': {
    id: 'photography-composition-tips',
    title: 'Photography Composition Tips That Actually Work',
    excerpt: 'Master these 7 composition rules that professional photographers use to create stunning images.',
    content: `Great photography isn't just about having the right equipment – it's about understanding composition. After shooting over 50,000 photos, I've learned that composition makes or breaks an image.

## The Rule of Thirds (And When to Break It)

The rule of thirds is the most basic composition technique, but most people use it wrong. Here's the right way:

- Place your main subject on one of the four intersection points
- Use the grid lines to align horizons and important elements
- Don't be afraid to break this rule for dramatic effect

**Pro tip:** Most cameras have a rule of thirds grid overlay. Turn it on and use it religiously until it becomes second nature.

## Leading Lines That Actually Lead

Leading lines should guide the viewer's eye to your subject, not away from it. Here's what works:

- Roads, rivers, and pathways create natural leading lines
- Architectural elements like railings and stairs work great
- Use diagonal lines for more dynamic compositions
- Avoid lines that lead out of the frame

## The Power of Negative Space

Negative space isn't empty space – it's breathing room for your subject. Use it to:

- Create a sense of scale and isolation
- Emphasize your main subject
- Add a minimalist, clean aesthetic
- Balance busy compositions

## Framing Your Subject

Natural frames add depth and focus to your images:

- Use doorways, windows, and archways
- Tree branches and foliage create organic frames
- Architectural elements work for urban photography
- Don't overdo it – the frame should enhance, not distract

## Symmetry and Patterns

Humans are naturally drawn to symmetry and patterns:

- Look for reflections in water, glass, and mirrors
- Find repeating patterns in architecture and nature
- Use perfect symmetry for a formal, balanced look
- Break patterns for visual interest

## Depth of Field Control

Controlling what's in focus is crucial for good composition:

- Use shallow depth of field to isolate your subject
- Stop down for maximum sharpness in landscapes
- Focus on the eyes for portraits
- Use hyperfocal distance for maximum sharpness

## Color and Light as Composition Tools

Color and light are powerful composition elements:

- Use complementary colors for visual impact
- Look for warm vs. cool color contrasts
- Use light to create mood and atmosphere
- Pay attention to the quality and direction of light

Remember: these rules are guidelines, not laws. The best photographers know when to follow them and when to break them for creative effect.`,
    date: '2024-01-05',
    category: 'Photography',
    tags: ['photography', 'composition', 'tips', 'techniques']
  },
  'image-optimization-guide': {
    id: 'image-optimization-guide',
    title: 'The Complete Image Optimization Guide: Speed Up Your Website by 70%',
    excerpt: 'Learn the exact techniques I use to optimize images and improve website loading times dramatically.',
    content: `Website speed matters more than ever. After optimizing images for over 500 websites, I've learned that proper image optimization can improve loading times by 70% or more. Here's everything you need to know.

## Why Image Optimization Matters

Images account for 60-80% of a webpage's total size. A single unoptimized image can slow down your entire site. Here's what happens when you optimize:

- **Faster loading times** = Better user experience
- **Lower bounce rates** = Higher conversion rates
- **Better SEO rankings** = More organic traffic
- **Reduced bandwidth costs** = Lower hosting bills

## The 4-Step Optimization Process

I use this exact process for every image:

### 1. Choose the Right Format

**JPEG:** Best for photos with many colors
- Use for: Photographs, complex images, screenshots
- Quality: 80-90% for web use
- Avoid: Images with transparency

**PNG:** Best for images with transparency
- Use for: Logos, graphics, images with transparency
- PNG-8: For simple graphics with few colors
- PNG-24: For complex graphics with transparency

**WebP:** The future of web images
- 25-35% smaller than JPEG
- Better compression with same quality
- Use as fallback for older browsers

### 2. Resize for Your Use Case

Never upload a 4000px image for a 300px thumbnail. Here's my sizing strategy:

- **Hero images:** 1920px wide maximum
- **Blog post images:** 800px wide maximum
- **Thumbnails:** 300px wide maximum
- **Mobile-first:** Always consider mobile users

### 3. Compress Without Losing Quality

**Online tools I use:**
- TinyPNG: Best for PNG compression
- JPEGmini: Excellent for JPEG optimization
- Squoosh: Google's free compression tool

**Desktop tools:**
- ImageOptim (Mac): Batch processing
- RIOT (Windows): Advanced compression
- Photoshop: Save for Web feature

### 4. Implement Responsive Images

Use the srcset attribute for different screen sizes:

\`\`\`html
<img 
  src="image-800w.jpg"
  srcset="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Description"
>
\`\`\`

## Advanced Optimization Techniques

### Lazy Loading

Load images only when they're about to enter the viewport:

\`\`\`html
<img src="image.jpg" loading="lazy" alt="Description">
\`\`\`

### Progressive JPEG

Loads in stages, showing a low-quality version first, then improving quality.

### CDN Implementation

Use a Content Delivery Network to serve images from servers closer to your users.

## My Optimization Checklist

Before publishing any image, I check:

- [ ] Correct format chosen (JPEG/PNG/WebP)
- [ ] Properly resized for use case
- [ ] Compressed without visible quality loss
- [ ] Alt text added for accessibility
- [ ] Responsive images implemented
- [ ] Lazy loading enabled
- [ ] CDN configured

## Tools and Resources

**Free tools:**
- TinyPNG: PNG compression
- Squoosh: Google's compression tool
- ImageOptim: Mac batch processing

**Paid tools:**
- JPEGmini: Professional JPEG optimization
- Kraken.io: Advanced compression
- Cloudinary: Image management platform

## Common Mistakes to Avoid

1. **Uploading full-resolution images** for thumbnails
2. **Using PNG for photos** (use JPEG instead)
3. **Forgetting alt text** (hurts SEO and accessibility)
4. **Not implementing lazy loading** (slows initial page load)
5. **Ignoring mobile users** (optimize for all devices)

Remember: optimization is an ongoing process. Regularly audit your images and update your optimization strategy as new tools and techniques become available.`,
    date: '2024-01-01',
    category: 'Web Development',
    tags: ['image-optimization', 'web-performance', 'seo', 'speed']
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </nav>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.date}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex gap-3">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">{children}</h3>,
                p: ({children}) => <p className="mb-6 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-6 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-6 space-y-2">{children}</ol>,
                li: ({children}) => <li className="leading-relaxed">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                a: ({children, href}) => <a href={href} className="text-blue-600 hover:underline">{children}</a>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}