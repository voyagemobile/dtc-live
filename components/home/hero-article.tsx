import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface HeroArticleProps {
  post: GhostPost
  secondaryPosts?: GhostPost[]
}

/**
 * Bold editorial hero: split layout with video/image on one side
 * and oversized headline on the other, separated by a brand-pink
 * vertical accent. Secondary stories in a tight row below.
 */
export function HeroArticle({ post, secondaryPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5">
        {/* ── Main hero: split layout ── */}
        <div className="grid grid-cols-1 gap-0 py-8 lg:grid-cols-2 lg:gap-0 lg:py-10">
          {/* Left: media */}
          <div className="order-1 lg:order-1 lg:pr-8">
            <Link href={href} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
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
                ) : post.feature_image ? (
                  <Image
                    src={post.feature_image}
                    alt={post.feature_image_alt || post.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface" />
                )}
              </div>
            </Link>
          </div>

          {/* Right: headline block with pink left border */}
          <div className="order-2 mt-6 flex flex-col justify-center lg:order-2 lg:mt-0 lg:border-l-4 lg:border-primary lg:pl-8">
            {post.primary_tag && (
              <span className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">
                {post.primary_tag.name}
              </span>
            )}
            <Link href={href} className="group">
              <h1 className="font-heading text-3xl font-bold leading-[1.1] text-text-headline transition-colors duration-150 group-hover:text-primary sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
                {post.title}
              </h1>
            </Link>
            <p className="mt-4 text-base leading-relaxed text-text-muted lg:text-lg">
              {excerpt}
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wider text-text-caption">
              {post.primary_author && (
                <>
                  <span className="font-medium text-text-headline">{post.primary_author.name}</span>
                  <span aria-hidden="true">&middot;</span>
                </>
              )}
              {post.published_at && (
                <>
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  <span aria-hidden="true">&middot;</span>
                </>
              )}
              <span>{formatReadingTime(post.reading_time)}</span>
            </div>
            <Link
              href={href}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-primary-hover"
            >
              Read Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Secondary stories row ── */}
        {secondaryPosts.length > 0 && (
          <div className="border-t border-border">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {secondaryPosts.slice(0, 4).map((p, i) => (
                <SecondaryCard key={p.id} post={p} index={i + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SecondaryCard({ post, index }: { post: GhostPost; index: number }) {
  const video = extractVideo(post.html)
  return (
    <article className="group py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
      <Link href={`/${post.slug}`} className="flex gap-4">
        {/* Rank number */}
        <span className="font-heading text-3xl font-bold leading-none text-border/50">
          {index}
        </span>
        <div className="flex flex-1 flex-col justify-center">
          {post.primary_tag && (
            <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              {post.primary_tag.name}
            </span>
          )}
          <h3 className="font-heading text-sm font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
            {post.title}
          </h3>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-text-caption">
            {formatReadingTime(post.reading_time)}
          </span>
        </div>
      </Link>
    </article>
  )
}
