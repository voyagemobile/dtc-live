import { cache } from 'react'
import { createHmac } from 'crypto'
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
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY

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

/**
 * Rewrite Ghost media URLs in post HTML and fields so browsers load images
 * and videos directly from Ghost's origin instead of through our proxy.
 *
 * Handles three URL patterns found in Ghost HTML:
 *  1. Relative:      /content/images/...
 *  2. Old custom domain: https://dtc.live/content/images/...
 *  3. Already correct:   https://dtc-live.ghost.io/content/images/... (no-op)
 */
const GHOST_ORIGIN = GHOST_API_URL?.replace(/\/$/, '') || 'https://dtc-live.ghost.io'

function rewriteGhostMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  // Already pointing to Ghost origin — leave it
  if (url.startsWith(GHOST_ORIGIN)) return url
  // Relative /content/images/ path
  if (url.startsWith('/content/images/')) return `${GHOST_ORIGIN}${url}`
  // Old custom domain reference
  if (url.startsWith('https://dtc.live/content/images/')) {
    return url.replace('https://dtc.live/content/images/', `${GHOST_ORIGIN}/content/images/`)
  }
  return url
}

function rewriteGhostHtml(html: string | null): string | null {
  if (!html) return null
  return html
    // Relative URLs in src/poster/href attributes
    .replace(/(src|poster|href)="\/content\/images\//g, `$1="${GHOST_ORIGIN}/content/images/`)
    // Old custom domain URLs
    .replace(/(src|poster|href)="https:\/\/dtc\.live\/content\/images\//g, `$1="${GHOST_ORIGIN}/content/images/`)
    // data-kg-thumbnail attribute (used by video cards)
    .replace(/data-kg-thumbnail="\/content\/images\//g, `data-kg-thumbnail="${GHOST_ORIGIN}/content/images/`)
    .replace(/data-kg-thumbnail="https:\/\/dtc\.live\/content\/images\//g, `data-kg-thumbnail="${GHOST_ORIGIN}/content/images/`)
}

function rewritePostUrls(post: Record<string, unknown>): Record<string, unknown> {
  const patched = { ...post }
  // Rewrite HTML body
  if (typeof patched.html === 'string') {
    patched.html = rewriteGhostHtml(patched.html)
  }
  // Rewrite image fields
  for (const field of ['feature_image', 'og_image', 'twitter_image']) {
    if (typeof patched[field] === 'string') {
      patched[field] = rewriteGhostMediaUrl(patched[field] as string)
    }
  }
  return patched
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

  const data = (await res.json()) as T

  // Rewrite media URLs so browsers load directly from Ghost
  const obj = data as Record<string, unknown>
  if (obj && typeof obj === 'object') {
    for (const key of ['posts', 'pages']) {
      const collection = obj[key]
      if (Array.isArray(collection)) {
        obj[key] = collection.map(rewritePostUrls)
      }
    }
  }

  return data
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

export const getPageBySlug = cache(async (slug: string): Promise<GhostPost | null> => {
  const url = buildUrl('pages/slug/' + encodeURIComponent(slug), {
    include: POST_INCLUDE,
    formats: POST_FORMATS,
    fields: POST_FIELDS,
  })
  try {
    const data = await fetchGhost<{ pages: GhostPost[] }>(url)
    return data.pages[0] ?? null
  } catch (err) {
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

// ---------------------------------------------------------------------------
// Ghost Admin API — used for member (newsletter) subscriptions.
// The Admin API authenticates via a short-lived JWT signed with an HMAC key
// derived from the admin API key (format: "id:secret").
// ---------------------------------------------------------------------------

function createAdminToken(): string {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY environment variable is not set')
  }

  const [id, secret] = GHOST_ADMIN_API_KEY.split(':')
  if (!id || !secret) {
    throw new Error('GHOST_ADMIN_API_KEY must be in "id:secret" format')
  }

  const now = Math.floor(Date.now() / 1000)

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })).toString(
    'base64url'
  )
  const payload = Buffer.from(
    JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })
  ).toString('base64url')

  const signature = createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${signature}`
}

/**
 * Add a member (newsletter subscriber) via the Ghost Admin API.
 * Returns { success: true } on success, or throws on failure.
 */
export async function addMember(
  email: string
): Promise<{ success: true; status: number }> {
  if (!GHOST_API_URL) {
    throw new Error('GHOST_API_URL environment variable is not set')
  }
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error('GHOST_ADMIN_API_KEY environment variable is not set')
  }

  const token = createAdminToken()
  const url = `${GHOST_API_URL.replace(/\/$/, '')}/ghost/api/admin/members/`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Ghost ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      members: [{ email, subscribed: true }],
    }),
    cache: 'no-store',
  })

  if (res.status === 201) {
    return { success: true, status: 201 }
  }

  if (res.status === 422) {
    // Member already exists
    return { success: true, status: 200 }
  }

  const safeUrl = url.split('?')[0]
  throw new Error(
    `Ghost Admin API request failed: ${res.status} ${res.statusText} — ${safeUrl}`
  )
}
