import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface LatestFeedProps {
  posts: GhostPost[]
}

/**
 * Latest articles in a 2-column NYT-style layout:
 * - Left (wider): stories with images, separated by thin dividers
 * - Right: text-only headlines with numbered ranking
 */
export function LatestFeed({ posts }: LatestFeedProps) {
  if (posts.length === 0) return null

  const mainPosts = posts.slice(0, 5)
  const sidebarPosts = posts.slice(0, 5)

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        {/* Section label */}
        <div className="mb-6 border-b-2 border-foreground pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-headline">
            Latest
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] lg:divide-x lg:divide-border">
          {/* Main column */}
          <div className="divide-y divide-border lg:pr-6">
            {mainPosts.map((post) => (
              <LatestStory key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar: Most Popular */}
          <aside className="hidden lg:block lg:pl-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-text-headline">
              Most Read
            </h3>
            <div className="divide-y divide-border">
              {sidebarPosts.map((post, i) => (
                <div key={post.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="font-heading text-2xl font-bold leading-none text-border/60">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <Link href={`/${post.slug}`} className="group">
                      <h4 className="font-heading text-sm font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
                        {post.title}
                      </h4>
                    </Link>
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-text-caption">
                      {formatReadingTime(post.reading_time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function LatestStory({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group flex gap-5 py-5 first:pt-0 last:pb-0">
      {/* Text */}
      <div className="flex flex-1 flex-col justify-center">
        {post.primary_tag && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <Link href={href}>
          <h3 className="font-heading text-lg font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-xl">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {excerpt}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
          {post.primary_author && (
            <>
              <span>{post.primary_author.name}</span>
              <span aria-hidden="true">&middot;</span>
            </>
          )}
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      {(video || post.feature_image) && (
        <Link href={href} className="relative hidden shrink-0 sm:block">
          <div className="relative h-[120px] w-[180px] overflow-hidden">
            {video ? (
              <video
                src={video.src}
                poster={video.thumbnail || post.feature_image || undefined}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={post.feature_image!}
                alt={post.feature_image_alt || post.title}
                fill
                sizes="180px"
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            )}
          </div>
        </Link>
      )}
    </article>
  )
}
