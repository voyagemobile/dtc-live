import { cache } from 'react'
import type {
  GhostPost,
  GhostTag,
  GhostAuthor,
  GhostPostsResponse,
  GhostTagsResponse,
  GhostAuthorsResponse,
} from './types'

const GHOST_API_URL = process.env.GHOST_API_URL
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY

// Fields to include on every post request.
// codeinjection_head / codeinjection_foot / og_image / meta_description /
// custom_excerpt are included so downstream code can inspect them for
// animated video URLs used by the homepage hover-to-play card feature.
const POST_INCLUDE = 'tags,authors'
const POST_FORMATS = 'html'
const POST_FIELDS = [
  'id',
  'title',
  'slug',
  'html',
  'feature_image',
  'feature_image_alt',
  'feature_image_caption',
  'excerpt',
  'custom_excerpt',
  'reading_time',
  'featured',
  'published_at',
  'updated_at',
  'created_at',
  'codeinjection_head',
  'codeinjection_foot',
  'og_image',
  'og_title',
  'og_description',
  'twitter_image',
  'twitter_title',
  'twitter_description',
  'meta_title',
  'meta_description',
  'canonical_url',
  'url',
  'primary_tag',
  'primary_author',
].join(',')

// ISR revalidation interval (5 minutes).
const REVALIDATE = 300

function buildUrl(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): string {
  if (!GHOST_API_URL) {
    throw new Error('GHOST_API_URL environment variable is not set')
  }
  if (!GHOST_CONTENT_API_KEY) {
    throw new Error('GHOST_CONTENT_API_KEY environment variable is not set')
  }

  const base = `${GHOST_API_URL.replace(/\/$/, '')}/ghost/api/content/${endpoint}/`
  const search = new URLSearchParams({ key: GHOST_CONTENT_API_KEY })

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) {
      search.set(k, String(v))
    }
  }

  return `${base}?${search.toString()}`
}

async function fetchGhost<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE },
  })

  if (!res.ok) {
    // Strip query string from URL before logging to avoid leaking the API key.
    const safeUrl = url.split('?')[0]
    throw new Error(
      `Ghost API request failed: ${res.status} ${res.statusText} — ${safeUrl}`
    )
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Public API functions — all wrapped with React.cache() for per-request
// deduplication in Server Components (Next.js App Router).
// ---------------------------------------------------------------------------

export const getPosts = cache(
  async (options: { limit?: number; page?: number } = {}): Promise<GhostPostsResponse> => {
    const url = buildUrl('posts', {
      include: POST_INCLUDE,
      formats: POST_FORMATS,
      fields: POST_FIELDS,
      limit: options.limit ?? 15,
      page: options.page ?? 1,
    })
    return fetchGhost<GhostPostsResponse>(url)
  }
)

export const getPostBySlug = cache(
  async (slug: string): Promise<GhostPost | null> => {
    const url = buildUrl('posts/slug/' + encodeURIComponent(slug), {
      include: POST_INCLUDE,
      formats: POST_FORMATS,
      fields: POST_FIELDS,
    })
    try {
      const data = await fetchGhost<{ posts: GhostPost[] }>(url)
      return data.posts[0] ?? null
    } catch (err) {
      // Re-throw configuration errors so misconfigurations are visible.
      // Only treat HTTP 404-style fetch failures as a missing post (null).
      if (err instanceof Error && err.message.startsWith('Ghost API request failed: 404')) {
        return null
      }
      throw err
    }
  }
)

export const getFeaturedPosts = cache(
  async (limit = 6): Promise<GhostPost[]> => {
    const url = buildUrl('posts', {
      include: POST_INCLUDE,
      formats: POST_FORMATS,
      fields: POST_FIELDS,
      filter: 'featured:true',
      limit,
    })
    const data = await fetchGhost<GhostPostsResponse>(url)
    return data.posts
  }
)

export const getPostsByTag = cache(
  async (
    tagSlug: string,
    options: { limit?: number; page?: number } = {}
  ): Promise<GhostPostsResponse> => {
    const url = buildUrl('posts', {
      include: POST_INCLUDE,
      formats: POST_FORMATS,
      fields: POST_FIELDS,
      filter: `tag:${tagSlug}`,
      limit: options.limit ?? 15,
      page: options.page ?? 1,
    })
    return fetchGhost<GhostPostsResponse>(url)
  }
)

export const getTags = cache(async (): Promise<GhostTag[]> => {
  const url = buildUrl('tags', {
    include: 'count.posts',
    limit: 'all',
  })
  const data = await fetchGhost<GhostTagsResponse>(url)
  return data.tags
})

export const getAuthors = cache(async (): Promise<GhostAuthor[]> => {
  const url = buildUrl('authors', {
    include: 'count.posts',
    limit: 'all',
  })
  const data = await fetchGhost<GhostAuthorsResponse>(url)
  return data.authors
})

export const getTagBySlug = cache(async (slug: string): Promise<GhostTag | null> => {
  const url = buildUrl('tags/slug/' + encodeURIComponent(slug), {
    include: 'count.posts',
  })
  try {
    const data = await fetchGhost<{ tags: GhostTag[] }>(url)
    return data.tags[0] ?? null
  } catch (err) {
    // Re-throw configuration errors so misconfigurations are visible.
    // Only treat HTTP 404-style fetch failures as a missing tag (null).
    if (err instanceof Error && err.message.startsWith('Ghost API request failed: 404')) {
      return null
    }
    throw err
  }
})

export const getAuthorBySlug = cache(async (slug: string): Promise<GhostAuthor | null> => {
  const url = buildUrl('authors/slug/' + encodeURIComponent(slug), {
    include: 'count.posts',
  })
  try {
    const data = await fetchGhost<{ authors: GhostAuthor[] }>(url)
    return data.authors[0] ?? null
  } catch (err) {
    // Re-throw configuration errors so misconfigurations are visible.
    // Only treat HTTP 404-style fetch failures as a missing author (null).
    if (err instanceof Error && err.message.startsWith('Ghost API request failed: 404')) {
      return null
    }
    throw err
  }
})

export const getPostsByAuthor = cache(
  async (
    authorSlug: string,
    options: { limit?: number; page?: number } = {}
  ): Promise<GhostPostsResponse> => {
    const url = buildUrl('posts', {
      include: POST_INCLUDE,
      formats: POST_FORMATS,
      fields: POST_FIELDS,
      filter: `author:${authorSlug}`,
      limit: options.limit ?? 15,
      page: options.page ?? 1,
    })
    return fetchGhost<GhostPostsResponse>(url)
  }
)
