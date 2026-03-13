import { getPosts } from '@/lib/ghost'

export const revalidate = 3600

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toRfc822(dateStr: string | null): string {
  if (!dateStr) return new Date(0).toUTCString()
  return new Date(dateStr).toUTCString()
}

export async function GET(): Promise<Response> {
  let posts: Awaited<ReturnType<typeof getPosts>>['posts']

  try {
    const data = await getPosts({ limit: 20 })
    posts = data.posts
  } catch (err) {
    console.error('RSS feed: failed to fetch posts from Ghost', err)
    return new Response('Failed to generate RSS feed', { status: 500 })
  }

  const items = posts
    .map((post) => {
      const link = `https://dtc.live/${post.slug}`
      const description = post.custom_excerpt ?? post.excerpt ?? ''
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${toRfc822(post.published_at)}</pubDate>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DTC Live</title>
    <description>The DTC industry's leading media brand.</description>
    <link>https://dtc.live</link>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
