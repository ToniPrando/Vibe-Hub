export type Language = 'pt' | 'en' | 'es';

export interface Category {
  id: string;
  name: Record<Language, string>;
  slug: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: Record<Language, string>;
  icon: string;
}

export interface Author {
  name: string;
  avatar: string;
  role: Record<Language, string>;
  bio: Record<Language, string>;
}

export interface Comment {
  id: string;
  articleId: string;
  parentId?: string | null;
  authorName: string;
  authorAvatar: string;
  authorRole?: 'reader' | 'author' | 'vip' | 'moderator';
  content: string;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
}

export interface ArticleContentSection {
  type: 'paragraph' | 'heading' | 'quote' | 'image' | 'callout' | 'list';
  content: string;
  caption?: string;
  author?: string;
  items?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Markdown / prose text
  sections?: ArticleContentSection[];
  categoryId: string;
  tags: string[];
  coverImage: string;
  coverImageCaption?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // in minutes
  views: number;
  likes: number;
  likedByMe?: boolean;
  shares: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  status: 'published' | 'draft';
  translations?: {
    [key in Language]?: {
      title: string;
      subtitle: string;
      excerpt: string;
      content: string;
    };
  };
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  frequency: 'daily' | 'weekly' | 'breaking';
  topics: string[];
  subscribedAt: string;
}

export type ThemeMode = 'light' | 'dark';

export interface CustomLogoMedia {
  type: 'image' | 'video';
  url: string;
  name?: string;
}

export interface BackgroundAnimationConfig {
  enabled: boolean;
  videoUrl?: string | null;
  opacity: number;
  mode: 'canvas3d' | 'video';
}
