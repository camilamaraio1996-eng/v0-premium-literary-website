export interface Podcast {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  link_url: string
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
