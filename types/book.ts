/**
 * Book-related types and interfaces
 * Consolidated type definitions for all book sections
 */

export interface BookFragment {
  id: string
  title: string
  chapter_number: number | null
  content: string
  sort_order: number
}

export interface Book {
  id: string
  title: string
  slug: string
  cover_image_url: string | null
  description: string | null
  video_url: string | null
  published_at: string
  created_at: string
  updated_at: string
}

export interface BookHeroProps {
  coverImage: string | null
  bookTitle: string
  buyUrl: string | null
  buyLabel: string
}

export interface BookFragmentsProps {
  fragments: BookFragment[]
}

export interface PremiumYoutubePlayerProps {
  videoId?: string
  title?: string
  autoplay?: boolean
}

export interface SiteSettings {
  [key: string]: string | number | boolean | null
}

export type BookQueryResult = {
  book: Book | null
  fragments: BookFragment[]
  settings: SiteSettings
}
