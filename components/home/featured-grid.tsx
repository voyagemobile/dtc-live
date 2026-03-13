import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface FeaturedGridProps {
  posts: GhostPost[]
}

/**
 * Asymmetric editorial grid: 1 large card left + 2 stacked right.
 * Bold imagery with animated videos. Below the hero section.
 */
export function FeaturedGrid({ posts }: FeaturedGridProps) {
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        {/* Section label */}
        <div className="mb-6 border-b-2 border-foreground pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-headline">
            Editor&rsquo;s Picks
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-0 lg:divide-x lg:divide-border">
          {/* Lead story: large card */}
          {lead && <LeadCard post={lead} />}

          {/* Stacked stories */}
          {rest.length > 0 && (
            <div className="flex flex-col divide-y divide-border lg:pl-6">
              {rest.slice(0, 2).map((post) => (
                <StackedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function LeadCard({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group lg:pr-6">
      <Link href={href} className="block">
        {(video || post.feature_image) && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm">
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
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            )}
          </div>
        )}
      </Link>
      {post.primary_tag && (
        <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-wider text-primary">
          {post.primary_tag.name}
        </span>
      )}
      <Link href={href} className="group">
        <h3 className="mt-1 font-heading text-xl font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-2xl">
          {post.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted lg:text-base">
        {excerpt}
      </p>
      <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
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
    </article>
  )
}

function StackedCard({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group flex flex-1 gap-5 py-5 first:pt-0 last:pb-0">
      <div className="flex flex-1 flex-col justify-center">
        {post.primary_tag && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <Link href={href}>
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
      </div>
      {(video || post.feature_image) && (
        <Link href={href} className="relative hidden shrink-0 sm:block">
          <div className="relative h-[110px] w-[160px] overflow-hidden rounded-sm">
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
                sizes="160px"
                className="object-cover"
              />
            )}
          </div>
        </Link>
      )}
    </article>
  )
}
