/**
 * Utilities for extracting video data from Ghost post HTML.
 *
 * Ghost stores 5-second animated "feature images" as kg-video-card figures
 * at the end of the article body. The video filename matches the feature_image
 * filename (e.g. "my-post.png" → "my-post.mp4").
 *
 * We extract the video URL to use as an animated banner, then strip the
 * kg-video-card from the body HTML so it doesn't appear twice.
 */

export interface PostVideo {
  /** Direct .mp4 URL from Ghost storage */
  src: string
  /** Thumbnail .jpg URL */
  thumbnail: string
  /** Video dimensions */
  width: number
  height: number
}

/**
 * Extract video metadata from a Ghost post's HTML.
 * Returns null if no kg-video-card is found.
 */
export function extractVideo(html: string | null): PostVideo | null {
  if (!html) return null

  // Match the video src from the kg-video-card
  const videoMatch = html.match(
    /<figure[^>]*kg-video-card[^>]*>[\s\S]*?<video\s+src="([^"]+\.mp4)"[^>]*>/
  )
  if (!videoMatch) return null

  const src = videoMatch[1]

  // Extract width/height from the video tag
  const fullTag = videoMatch[0]
  const widthMatch = fullTag.match(/width="(\d+)"/)
  const heightMatch = fullTag.match(/height="(\d+)"/)
  const width = parseInt(widthMatch?.[1] || '1284', 10)
  const height = parseInt(heightMatch?.[1] || '716', 10)

  // Extract thumbnail from data-kg-thumbnail attribute
  const thumbMatch = html.match(/data-kg-thumbnail="([^"]+)"/)
  const thumbnail = thumbMatch?.[1] || ''

  return { src, thumbnail, width, height }
}

/**
 * Remove all kg-video-card figures from Ghost HTML.
 * This prevents the video player from appearing in the article body
 * when we're already showing it as the banner.
 */
export function stripVideoCards(html: string | null): string {
  if (!html) return ''
  return html.replace(
    /<figure class="kg-card kg-video-card[^"]*"[^>]*>[\s\S]*?<\/figure>/g,
    ''
  )
}
