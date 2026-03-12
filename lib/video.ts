import type { GhostPost } from './types'

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i

/**
 * Extract a video URL from a Ghost post's metadata fields.
 *
 * Ghost doesn't have a native video field, so editors store video URLs in
 * codeinjection_head, codeinjection_foot, og_image, or twitter_image.
 * This function checks all four and returns the first URL that looks like
 * a video file.
 */
export function extractVideoUrl(post: GhostPost): string | null {
  // Check og_image and twitter_image first (most likely locations for a URL)
  for (const field of [post.og_image, post.twitter_image] as const) {
    if (field && VIDEO_EXTENSIONS.test(field)) {
      return field
    }
  }

  // Check code injection fields for video URLs embedded in HTML or raw text
  for (const field of [post.codeinjection_head, post.codeinjection_foot] as const) {
    if (!field) continue
    // Try to find a raw URL with a video extension
    const urlMatch = field.match(
      /https?:\/\/[^\s"'<>]+\.(mp4|webm|mov|m4v)(\?[^\s"'<>]*)?/i
    )
    if (urlMatch) {
      return urlMatch[0]
    }
  }

  return null
}
