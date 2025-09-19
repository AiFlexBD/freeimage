-- Add slug column to images table
ALTER TABLE images ADD COLUMN slug TEXT;

-- Create index for efficient slug lookups
CREATE INDEX idx_images_slug ON images(slug);

-- Create unique constraint to prevent duplicate slugs
CREATE UNIQUE INDEX idx_images_slug_unique ON images(slug);

