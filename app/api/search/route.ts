import { NextRequest, NextResponse } from 'next/server'
import type { GhostPost } from '@/lib/types'

const GHOST_API_URL = process.env.GHOST_API_URL
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY

/**
 * GET /api/search?q=keyword
 *
 * Server-side proxy to Ghost Content API search.
 * Keeps the API key out of the browser bundle.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('q')?.trim()

  if (!raw) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 })
  }

  // Enforce a max length to prevent excessively large filter strings being
  // sent to the Ghost API.
  const q = raw.slice(0, 100)

  // Validate: must not be empty after truncation (edge-case: whitespace-only > 100 chars)
  if (!q.trim()) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 })
  }

  if (!GHOST_API_URL || !GHOST_CONTENT_API_KEY) {
    return NextResponse.json({ posts: [] }, { status: 200 })
  }

  try {
    // Ghost filter: title contains keyword OR custom_excerpt contains keyword.
    // Escape single quotes in the query to prevent Ghost filter syntax errors.
    const safeQ = q.replace(/'/g, "\\'")
    const filter = `title:~'${safeQ}',custom_excerpt:~'${safeQ}'`
    const fields = 'title,slug,excerpt,custom_excerpt,feature_image,published_at,primary_tag'

    const url = new URL(
      `${GHOST_API_URL.replace(/\/$/, '')}/ghost/api/content/posts/`
    )
    url.searchParams.set('key', GHOST_CONTENT_API_KEY)
    url.searchParams.set('filter', filter)
    url.searchParams.set('fields', fields)
    url.searchParams.set('include', 'tags')
    url.searchParams.set('limit', '10')

    const res = await fetch(url.toString(), {
      // Do not cache search results — they should always be fresh
      cache: 'no-store',
    })

    if (!res.ok) {
      // Ghost returned an error; return empty results gracefully
      return NextResponse.json({ posts: [] }, { status: 200 })
    }

    const data = (await res.json()) as { posts: GhostPost[] }
    return NextResponse.json({ posts: data.posts ?? [] })
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}
