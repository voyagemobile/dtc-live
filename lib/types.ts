export interface GhostTag {
  id: string
  name: string
  slug: string
  description: string | null
  feature_image: string | null
  visibility: 'public' | 'internal' | string
  count?: {
    posts: number
  }
}

export interface GhostAuthor {
  id: string
  name: string
  slug: string
  profile_image: string | null
  bio: string | null
  website: string | null
  location: string | null
  count?: {
    posts: number
  }
}

export interface GhostPost {
  id: string
  title: string
  slug: string
  html: string | null
  feature_image: string | null
  feature_image_alt: string | null
  feature_image_caption: string | null
  excerpt: string | null
  custom_excerpt: string | null
  reading_time: number
  featured: boolean
  published_at: string | null
  updated_at: string | null
  created_at: string
  tags: GhostTag[]
  authors: GhostAuthor[]
  primary_tag: GhostTag | null
  primary_author: GhostAuthor | null
  // Code injection fields — may contain video URLs for hover-to-play
  codeinjection_head: string | null
  codeinjection_foot: string | null
  // Open graph / social fields — alternative video URL locations
  og_image: string | null
  og_title: string | null
  og_description: string | null
  // Twitter card fields
  twitter_image: string | null
  twitter_title: string | null
  twitter_description: string | null
  // Meta fields
  meta_title: string | null
  meta_description: string | null
  // Canonical URL
  canonical_url: string | null
  url: string
}

export interface GhostPagination {
  page: number
  limit: number
  pages: number
  total: number
  next: number | null
  prev: number | null
}

export interface GhostMeta {
  pagination: GhostPagination
}

export interface GhostPostsResponse {
  posts: GhostPost[]
  meta: GhostMeta
}

export interface GhostTagsResponse {
  tags: GhostTag[]
  meta: GhostMeta
}

export interface GhostAuthorsResponse {
  authors: GhostAuthor[]
  meta: GhostMeta
}
