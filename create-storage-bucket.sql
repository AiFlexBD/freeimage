-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Admins can delete images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM auth.users 
    JOIN public.users ON auth.users.id = public.users.id
    WHERE auth.users.id = auth.uid() 
    AND public.users.role = 'admin'
  )
); 