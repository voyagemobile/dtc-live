import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface LatestFeedProps {
  posts: GhostPost[]
}

/**
 * Latest articles: bold numbered list on the left (big rank numbers),
 * "Most Read" sidebar on the right. Inspired by directtoconsumer.co's
 * newsletter listing style.
 */
export function LatestFeed({ posts }: LatestFeedProps) {
  if (posts.length === 0) return null

  const mainPosts = posts.slice(0, 6)
  const sidebarPosts = posts.slice(0, 5)

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-10">
        {/* Section label with pink accent */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-headline">
            Latest
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_320px] lg:divide-x lg:divide-border">
          {/* Main column: numbered articles */}
          <div className="divide-y divide-border lg:pr-8">
            {mainPosts.map((post, i) => (
              <NumberedArticle key={post.id} post={post} rank={i + 1} />
            ))}
          </div>

          {/* Sidebar: Most Read */}
          <aside className="hidden lg:block lg:pl-8">
            <div className="sticky top-24">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-headline">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                </svg>
                Most Read
              </h3>
              <div className="space-y-0 divide-y divide-border">
                {sidebarPosts.map((post, i) => (
                  <div key={post.id} className="flex gap-3 py-4 first:pt-0">
                    <span className="font-heading text-3xl font-bold leading-none text-primary/20">
                      {String(i + 1).padStart(2, '0')}
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
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function NumberedArticle({ post, rank }: { post: GhostPost; rank: number }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group flex gap-5 py-6 first:pt-0 last:pb-0">
      {/* Big rank number */}
      <span className="hidden shrink-0 font-heading text-5xl font-bold leading-none text-border/40 sm:block">
        {String(rank).padStart(2, '0')}
      </span>

      {/* Text content */}
      <div className="flex flex-1 flex-col justify-center">
        {post.primary_tag && (
          <span className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
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
        <div className="mt-2.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
          {post.primary_author && (
            <>
              <span className="font-medium">{post.primary_author.name}</span>
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
          <div className="relative h-[110px] w-[170px] overflow-hidden rounded-lg">
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
                sizes="170px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </Link>
      )}
    </article>
  )
}
