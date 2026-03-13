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
 * Dark magazine-spread hero. Lead story fills the left with a full-bleed
 * image; right side is a dark panel with bold white typography, excerpt,
 * and a pink "Read Article" CTA. Below: a trending strip with numbered
 * secondary stories on a dark background, separated by subtle dividers.
 * Creates dramatic contrast with the white page below.
 */
export function HeroArticle({ post, secondaryPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <section className="bg-[#0a0a0a]">
      {/* ── Lead story: image left, text right on dark ── */}
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image side */}
          <Link href={href} className="group relative block">
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[540px]">
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
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1a1a1a]" />
              )}
              {/* Subtle gradient on mobile where text is below */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent lg:hidden" />
            </div>
          </Link>

          {/* Text side — dark panel */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
            {post.primary_tag && (
              <span className="mb-4 inline-flex w-fit rounded-sm bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                {post.primary_tag.name}
              </span>
            )}
            <Link href={href} className="group">
              <h1 className="font-heading text-2xl font-bold leading-[1.12] text-white transition-colors duration-200 group-hover:text-primary sm:text-3xl lg:text-[2.5rem]">
                {post.title}
              </h1>
            </Link>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-white/60 lg:text-lg">
              {excerpt}
            </p>
            <div className="mt-4 flex items-center gap-2.5 text-[11px] uppercase tracking-wider text-white/40">
              {post.primary_author && (
                <>
                  <span className="font-medium text-white/60">{post.primary_author.name}</span>
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
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover"
            >
              Read Article
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trending strip ── */}
      {secondaryPosts.length > 0 && (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1280px] px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
              {secondaryPosts.slice(0, 4).map((p, i) => (
                <TrendingItem key={p.id} post={p} rank={i + 1} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function TrendingItem({ post, rank }: { post: GhostPost; rank: number }) {
  const href = `/${post.slug}`

  return (
    <Link href={href} className="group flex gap-4 px-1 py-5 lg:px-6">
      <span className="shrink-0 font-heading text-3xl font-bold leading-none text-primary/30">
        {String(rank).padStart(2, '0')}
      </span>
      <div className="flex-1">
        {post.primary_tag && (
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-white/90 transition-colors duration-150 group-hover:text-primary">
          {post.title}
        </h3>
        <span className="mt-1 block text-[10px] uppercase tracking-wider text-white/30">
          {post.published_at && formatDate(post.published_at)}
        </span>
      </div>
    </Link>
  )
}
