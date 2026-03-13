'use client'

import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate } from '@/lib/format'
import { extractVideo } from '@/lib/video'
import ScrollExpandMedia from '@/components/home/scroll-expand-media'

interface HeroExpandProps {
  post: GhostPost
}

/**
 * Wraps ScrollExpandMedia with the featured Ghost post data.
 * The article image starts as a centered card and expands to full viewport
 * as the user scrolls. Title words split apart during the expansion.
 */
export function HeroExpand({ post }: HeroExpandProps) {
  const featureImage = post.feature_image || '/og-image.png'
  const video = extractVideo(post.html)
  const tag = post.primary_tag?.name || ''
  const date = post.published_at ? formatDate(post.published_at) : ''

  return (
    <ScrollExpandMedia
      mediaType={video ? 'video' : 'image'}
      mediaSrc={video ? video.src : featureImage}
      posterSrc={video ? (video.thumbnail || featureImage) : undefined}
      bgImageSrc={featureImage}
      title={post.title}
      date={tag}
      scrollToExpand="Scroll to read"
      textBlend
    >
      {/* Content revealed after full expansion */}
      <div className="mx-auto max-w-3xl">
        <Link href={`/${post.slug}`} className="group block">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {tag}
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight text-text-headline sm:text-4xl lg:text-5xl group-hover:text-primary transition-colors">
            {post.title}
          </h1>
          {(post.custom_excerpt || post.excerpt) && (
            <p className="mt-4 text-lg leading-relaxed text-text-muted">
              {post.custom_excerpt || post.excerpt}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 text-sm text-text-caption">
            {post.primary_author && (
              <span className="font-medium text-text-headline">{post.primary_author.name}</span>
            )}
            {date && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={post.published_at || ''}>{date}</time>
              </>
            )}
            {post.reading_time && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
        </Link>
      </div>
    </ScrollExpandMedia>
  )
}
