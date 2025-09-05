export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageCount: number;
  featuredImage: string;
  sortOrder?: number;
}

export interface Image {
  id: string;
  title: string;
  description: string;
  filename: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  downloadUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  downloads: number;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'moderator' | 'user';
  avatarUrl?: string;
  createdAt: string;
}

export interface AIGeneration {
  id: string;
  userId: string;
  prompt: string;
  style?: string;
  quality: 'standard' | 'high';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  generatedImages?: string[];
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
} 