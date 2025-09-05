import { Image } from '@/types';

export const images: Image[] = [
  // Nature Images
  {
    id: 'nature-1',
    title: 'Mountain Sunset',
    description: 'Breathtaking mountain landscape at golden hour',
    filename: 'mountain-sunset.jpg',
    category: 'nature',
    tags: ['mountains', 'sunset', 'landscape', 'golden hour', 'nature'],
    width: 1920,
    height: 1080,
    downloadUrl: '/images/nature/mountain-sunset.jpg',
    thumbnailUrl: '/images/nature/thumbnails/mountain-sunset.jpg',
    createdAt: '2024-01-15',
    downloads: 1250
  },
  {
    id: 'nature-2',
    title: 'Forest Path',
    description: 'Peaceful forest trail surrounded by tall trees',
    filename: 'forest-path.jpg',
    category: 'nature',
    tags: ['forest', 'path', 'trees', 'nature', 'trail'],
    width: 1920,
    height: 1080,
    downloadUrl: '/images/nature/forest-path.jpg',
    thumbnailUrl: '/images/nature/thumbnails/forest-path.jpg',
    createdAt: '2024-01-16',
    downloads: 890
  },
  {
    id: 'business-1',
    title: 'Modern Office',
    description: 'Contemporary office space with natural lighting',
    filename: 'modern-office.jpg',
    category: 'business',
    tags: ['office', 'business', 'modern', 'workspace', 'professional'],
    width: 1920,
    height: 1080,
    downloadUrl: '/images/business/modern-office.jpg',
    thumbnailUrl: '/images/business/thumbnails/modern-office.jpg',
    createdAt: '2024-01-18',
    downloads: 750
  },
  {
    id: 'technology-1',
    title: 'Digital Network',
    description: 'Abstract representation of digital connectivity',
    filename: 'digital-network.jpg',
    category: 'technology',
    tags: ['technology', 'digital', 'network', 'connectivity', 'abstract'],
    width: 1920,
    height: 1080,
    downloadUrl: '/images/technology/digital-network.jpg',
    thumbnailUrl: '/images/technology/thumbnails/digital-network.jpg',
    createdAt: '2024-01-20',
    downloads: 650
  }
]; 