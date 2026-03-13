import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'
import { Badge } from '@/components/ui/badge'
import { VideoHover } from '@/components/article/video-hover'

type CardVariant = 'compact' | 'standard' | 'featured'

interface ArticleCardProps {
  post: GhostPost
  variant?: CardVariant
  priority?: boolean
  className?: string
}

/**
 * Reusable article card with three layout variants:
 *
 * - **compact**: Horizontal row with small thumbnail (latest feed, category lists)
 * - **standard**: Vertical card with medium image (featured grid smaller cards)
 * - **featured**: Large vertical card with oversized image (featured grid primary)
 */
export function ArticleCard({
  post,
  variant = 'standard',
  priority = false,
  className = '',
}: ArticleCardProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const video = extractVideo(post.html)
  const videoUrl = video?.src ?? null
  const href = `/${post.slug}`

  if (variant === 'compact') {
    return <CompactCard post={post} excerpt={excerpt} videoUrl={videoUrl} href={href} priority={priority} className={className} />
  }

  if (variant === 'featured') {
    return <FeaturedCard post={post} excerpt={excerpt} videoUrl={videoUrl} href={href} priority={priority} className={className} />
  }

  return <StandardCard post={post} excerpt={excerpt} videoUrl={videoUrl} href={href} priority={priority} className={className} />
}

// ---------------------------------------------------------------------------
// Compact: horizontal thumbnail + text (for latest feed rows)
// ---------------------------------------------------------------------------

function CompactCard({
  post,
  excerpt,
  videoUrl,
  href,
  priority,
  className,
}: {
  post: GhostPost
  excerpt: string
  videoUrl: string | null
  href: string
  priority: boolean
  className: string
}) {
  return (
    <article className={`group flex gap-5 ${className}`}>
      {/* Thumbnail */}
      <Link href={href} className="relative block shrink-0 overflow-hidden rounded-sm">
        <CardImage
          post={post}
          videoUrl={videoUrl}
          priority={priority}
          sizes="120px"
          className="h-[100px] w-[140px] sm:h-[110px] sm:w-[160px]"
        />
      </Link>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {post.primary_tag && (
          <Badge variant="primary" size="sm" className="mb-2 self-start">
            {post.primary_tag.name}
          </Badge>
        )}
        <Link href={href}>
          <h3 className="font-heading text-base font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary sm:text-lg">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted hidden sm:block">
          {excerpt}
        </p>
        <CardMeta post={post} className="mt-2" />
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Standard: vertical card (featured grid secondary slots)
// ---------------------------------------------------------------------------

function StandardCard({
  post,
  excerpt,
  videoUrl,
  href,
  priority,
  className,
}: {
  post: GhostPost
  excerpt: string
  videoUrl: string | null
  href: string
  priority: boolean
  className: string
}) {
  return (
    <article className={`group flex flex-col ${className}`}>
      <Link href={href} className="relative block overflow-hidden rounded-sm">
        <CardImage
          post={post}
          videoUrl={videoUrl}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[3/2] w-full"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        {post.primary_tag && (
          <Badge variant="primary" size="sm" className="mb-2 self-start">
            {post.primary_tag.name}
          </Badge>
        )}
        <Link href={href}>
          <h3 className="font-heading text-lg font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-xl">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {excerpt}
        </p>
        <CardMeta post={post} className="mt-3" />
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Featured: large hero-like card (featured grid primary slot)
// ---------------------------------------------------------------------------

function FeaturedCard({
  post,
  excerpt,
  videoUrl,
  href,
  priority,
  className,
}: {
  post: GhostPost
  excerpt: string
  videoUrl: string | null
  href: string
  priority: boolean
  className: string
}) {
  return (
    <article className={`group flex flex-col ${className}`}>
      <Link href={href} className="relative block overflow-hidden rounded-sm">
        <CardImage
          post={post}
          videoUrl={videoUrl}
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[16/10] w-full"
        />
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        {post.primary_tag && (
          <Badge variant="primary" size="sm" className="mb-3 self-start">
            {post.primary_tag.name}
          </Badge>
        )}
        <Link href={href}>
          <h3 className="font-heading text-2xl font-bold leading-tight text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-3xl">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-text-body">
          {excerpt}
        </p>
        <CardMeta post={post} className="mt-4" />
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function CardImage({
  post,
  videoUrl,
  priority,
  sizes,
  className,
}: {
  post: GhostPost
  videoUrl: string | null
  priority: boolean
  sizes: string
  className: string
}) {
  if (!post.feature_image) {
    return (
      <div className={`bg-surface ${className}`} />
    )
  }

  const image = (
    <Image
      src={post.feature_image}
      alt={post.feature_image_alt || post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )

  if (videoUrl) {
    return (
      <VideoHover videoUrl={videoUrl} className={`relative ${className}`}>
        {image}
      </VideoHover>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {image}
    </div>
  )
}

function CardMeta({ post, className = '' }: { post: GhostPost; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs text-text-caption ${className}`}>
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
  )
}
