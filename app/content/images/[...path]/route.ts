import { NextRequest, NextResponse } from 'next/server'

const GHOST_ORIGIN = 'https://dtc-live.ghost.io'

/**
 * Proxy Ghost content images.
 *
 * Article HTML contains /content/images/ URLs that Ghost stored when it
 * served the frontend. Now that Next.js serves dtc.live these would 404,
 * so this route fetches them from Ghost and streams them back.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const imagePath = path.join('/')
  const ghostUrl = `${GHOST_ORIGIN}/content/images/${imagePath}`

  try {
    const res = await fetch(ghostUrl, {
      headers: {
        Accept: 'image/*,*/*',
      },
      next: { revalidate: 86400 }, // Cache for 24h
    })

    if (!res.ok) {
      return new NextResponse(null, { status: res.status })
    }

    const body = res.body
    const contentType = res.headers.get('content-type') ?? 'image/png'
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
