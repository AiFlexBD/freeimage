-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_count INTEGER DEFAULT 0,
  featured_image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[],
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  download_url TEXT NOT NULL,
  thumbnail_url TEXT,
  downloads INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_generations table
CREATE TABLE IF NOT EXISTS ai_generations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  style TEXT,
  quality TEXT DEFAULT 'standard',
  aspect_ratio TEXT DEFAULT '1:1',
  generated_images JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  image_id TEXT REFERENCES images(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow public user insertion" ON users FOR INSERT WITH CHECK (true);

-- RLS Policies for categories table
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- RLS Policies for images table
CREATE POLICY "Images are publicly readable" ON images FOR SELECT USING (true);
CREATE POLICY "Only admins can modify images" ON images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- RLS Policies for ai_generations table
CREATE POLICY "Users can read own generations" ON ai_generations FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Users can create generations" ON ai_generations FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Admins can read all generations" ON ai_generations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- RLS Policies for downloads table
CREATE POLICY "Downloads are publicly readable" ON downloads FOR SELECT USING (true);
CREATE POLICY "Anyone can create download records" ON downloads FOR INSERT WITH CHECK (true);

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image_count, featured_image, sort_order) VALUES
  ('nature', 'Nature', 'nature', 'Beautiful landscapes, wildlife, and natural scenes', 150, '/images/nature/featured.jpg', 1),
  ('business', 'Business', 'business', 'Professional business environments and concepts', 120, '/images/business/featured.jpg', 2),
  ('technology', 'Technology', 'technology', 'Modern tech devices and digital concepts', 100, '/images/technology/featured.jpg', 3),
  ('people', 'People', 'people', 'Portraits and human interactions', 80, '/images/people/featured.jpg', 4),
  ('food', 'Food', 'food', 'Delicious dishes and culinary delights', 90, '/images/food/featured.jpg', 5),
  ('abstract', 'Abstract', 'abstract', 'Creative and artistic abstract designs', 70, '/images/abstract/featured.jpg', 6),
  ('travel', 'Travel', 'travel', 'Amazing destinations and travel photography', 110, '/images/travel/featured.jpg', 7),
  ('lifestyle', 'Lifestyle', 'lifestyle', 'Daily life and lifestyle photography', 95, '/images/lifestyle/featured.jpg', 8)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
); 