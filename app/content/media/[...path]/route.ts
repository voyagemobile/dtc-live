import { NextRequest, NextResponse } from 'next/server'

const GHOST_ORIGIN = 'https://dtc-live.ghost.io'

/**
 * Proxy Ghost content media (video thumbnails, etc.).
 *
 * Safety-net for any /content/media/ URLs that weren't rewritten at the
 * API layer. Most requests should already be rewritten to go directly to
 * Ghost, so this route should see minimal traffic.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const mediaPath = path.join('/')
  const ghostUrl = `${GHOST_ORIGIN}/content/media/${mediaPath}`

  try {
    const res = await fetch(ghostUrl, {
      headers: {
        Accept: '*/*',
      },
      next: { revalidate: 86400 }, // Cache for 24h
    })

    if (!res.ok) {
      return new NextResponse(null, { status: res.status })
    }

    const body = res.body
    const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
    const cacheControl = res.headers.get('cache-control') ?? 'public, max-age=31536000'

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new NextResponse(null, { status: 502 })
  }
}
