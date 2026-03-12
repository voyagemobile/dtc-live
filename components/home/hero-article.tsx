import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideoUrl } from '@/lib/video'
import { Badge } from '@/components/ui/badge'
import { VideoHover } from '@/components/article/video-hover'

interface HeroArticleProps {
  post: GhostPost
}

/**
 * Full-width hero section for the homepage.
 * Large cinematic image with text overlay on a dark gradient.
 * Uses next/image with `priority` for LCP optimization.
 */
export function HeroArticle({ post }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const videoUrl = extractVideoUrl(post)
  const href = `/${post.slug}`

  return (
    <section className="relative overflow-hidden bg-foreground">
      <Link href={href} className="group block">
        {/* Image / Video */}
        <HeroMedia post={post} videoUrl={videoUrl} />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          aria-hidden="true"
        />

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-[1280px]">
            {post.primary_tag && (
              <Badge variant="primary" size="md" className="mb-4">
                {post.primary_tag.name}
              </Badge>
            )}

            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="transition-colors duration-150 group-hover:text-primary">
                {post.title}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="mt-5 flex items-center gap-3 text-sm text-white/60">
              {post.primary_author && (
                <>
                  {post.primary_author.profile_image && (
                    <Image
                      src={post.primary_author.profile_image}
                      alt={post.primary_author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium text-white/80">
                    {post.primary_author.name}
                  </span>
                  <span aria-hidden="true" className="text-white/30">&middot;</span>
                </>
              )}
              {post.published_at && (
                <>
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                  <span aria-hidden="true" className="text-white/30">&middot;</span>
                </>
              )}
              <span>{formatReadingTime(post.reading_time)}</span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}

function HeroMedia({
  post,
  videoUrl,
}: {
  post: GhostPost
  videoUrl: string | null
}) {
  if (!post.feature_image) {
    return <div className="aspect-[21/9] w-full bg-surface" />
  }

  const image = (
    <Image
      src={post.feature_image}
      alt={post.feature_image_alt || post.title}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  )

  const containerClass = 'relative aspect-[21/9] w-full'

  if (videoUrl) {
    return (
      <VideoHover videoUrl={videoUrl} className={containerClass}>
        {image}
      </VideoHover>
    )
  }

  return (
    <div className={containerClass}>
      {image}
    </div>
  )
}
