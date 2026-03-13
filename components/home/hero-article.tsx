import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'

interface HeroArticleProps {
  post: GhostPost
  /** Sidebar stories shown left and right of the hero image */
  leftPosts?: GhostPost[]
  rightPosts?: GhostPost[]
}

/**
 * NYT-style 3-column hero layout:
 * - Left column: 2 text-only headline stories stacked
 * - Center: large feature image with headline overlay
 * - Right column: 2 text-only headline stories stacked
 *
 * Separated by thin vertical divider lines.
 */
export function HeroArticle({ post, leftPosts = [], rightPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5">
        {/* Desktop: 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] lg:divide-x lg:divide-border">
          {/* Left Column - headline stories */}
          <div className="hidden lg:block lg:pr-6 lg:py-8">
            <div className="flex h-full flex-col divide-y divide-border">
              {leftPosts.map((p) => (
                <SidebarStory key={p.id} post={p} />
              ))}
            </div>
          </div>

          {/* Center Column - hero */}
          <div className="py-6 lg:px-6 lg:py-8">
            <Link href={href} className="group block">
              {post.feature_image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={post.feature_image}
                    alt={post.feature_image_alt || post.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {post.feature_image_caption && (
                    <p
                      className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5 text-xs text-white/80"
                      dangerouslySetInnerHTML={{ __html: post.feature_image_caption }}
                    />
                  )}
                </div>
              )}

              <h1 className="mt-4 font-heading text-2xl font-bold leading-tight text-text-headline transition-colors duration-150 group-hover:text-primary sm:text-3xl lg:text-4xl">
                {post.title}
              </h1>
            </Link>

            <p className="mt-3 text-base leading-relaxed text-text-body">
              {excerpt}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-text-caption">
              {post.primary_author && (
                <>
                  <span className="font-medium text-text-muted">{post.primary_author.name}</span>
                  <span aria-hidden="true" className="text-border">&middot;</span>
                </>
              )}
              {post.published_at && (
                <>
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  <span aria-hidden="true" className="text-border">&middot;</span>
                </>
              )}
              <span>{formatReadingTime(post.reading_time)}</span>
            </div>
          </div>

          {/* Right Column - headline stories */}
          <div className="hidden lg:block lg:pl-6 lg:py-8">
            <div className="flex h-full flex-col divide-y divide-border">
              {rightPosts.map((p) => (
                <SidebarStory key={p.id} post={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: show sidebar stories below hero */}
        <div className="grid grid-cols-1 gap-0 divide-y divide-border border-t border-border pb-6 lg:hidden">
          {[...leftPosts, ...rightPosts].map((p) => (
            <SidebarStory key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Text-only sidebar story with bold headline and reading time.
 * Used in the left and right columns of the NYT-style hero.
 */
function SidebarStory({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  return (
    <article className="flex flex-1 flex-col justify-center py-4 first:pt-0 last:pb-0">
      {post.primary_tag && (
        <span className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          {post.primary_tag.name}
        </span>
      )}
      <Link href={`/${post.slug}`} className="group">
        <h3 className="font-heading text-base font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-lg">
          {post.title}
        </h3>
      </Link>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
        {excerpt}
      </p>
      <span className="mt-2 text-[11px] uppercase tracking-wider text-text-caption">
        {formatReadingTime(post.reading_time)}
      </span>
    </article>
  )
}
