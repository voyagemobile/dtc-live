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
 * Full-bleed magazine-cover hero. The headline lives ON TOP of
 * the feature image/video with a dramatic gradient overlay.
 * Secondary stories as a tight "Now Trending" bar below.
 */
export function HeroArticle({ post, secondaryPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <section>
      {/* ── Full-bleed cover ── */}
      <Link href={href} className="group relative block">
        <div className="relative h-[480px] w-full overflow-hidden sm:h-[540px] lg:h-[600px]">
          {/* Media layer */}
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
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-5 pb-10 lg:pb-14">
              {post.primary_tag && (
                <span className="mb-3 inline-block rounded-sm bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                  {post.primary_tag.name}
                </span>
              )}
              <h1 className="max-w-3xl font-heading text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
                {post.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-wider text-white/60">
                {post.primary_author && (
                  <>
                    <span className="font-medium text-white/90">{post.primary_author.name}</span>
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
            </div>
          </div>
        </div>
      </Link>

      {/* ── Trending bar ── */}
      {secondaryPosts.length > 0 && (
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1280px] px-5">
            <div className="flex items-center gap-0 overflow-x-auto">
              <span className="shrink-0 border-r border-border py-4 pr-5 text-[11px] font-bold uppercase tracking-widest text-primary">
                Trending
              </span>
              <div className="flex divide-x divide-border">
                {secondaryPosts.slice(0, 4).map((p, i) => (
                  <TrendingItem key={p.id} post={p} index={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function TrendingItem({ post, index }: { post: GhostPost; index: number }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex shrink-0 items-center gap-3 px-5 py-4"
    >
      <span className="font-heading text-2xl font-bold leading-none text-primary/30">
        {String(index).padStart(2, '0')}
      </span>
      <div className="max-w-[220px]">
        {post.primary_tag && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
