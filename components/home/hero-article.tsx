import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface HeroArticleProps {
  post: GhostPost
  /** Secondary stories displayed below the hero */
  secondaryPosts?: GhostPost[]
}

/**
 * Full-width cinematic hero with video/image background,
 * bold headline overlay, and a row of secondary story cards below.
 */
export function HeroArticle({ post, secondaryPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <section>
      {/* ── Full-bleed cinematic hero ── */}
      <Link href={href} className="group relative block">
        <div className="relative h-[70vh] min-h-[500px] max-h-[720px] w-full overflow-hidden">
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
              className="object-cover"
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
                <span className="mb-3 inline-block rounded-sm bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                  {post.primary_tag.name}
                </span>
              )}
              <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                {post.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                {post.primary_author && (
                  <>
                    <span className="font-medium text-white/80">{post.primary_author.name}</span>
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

      {/* ── Secondary stories row ── */}
      {secondaryPosts.length > 0 && (
        <div className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1280px] px-5">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {secondaryPosts.slice(0, 4).map((p) => (
                <SecondaryCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SecondaryCard({ post }: { post: GhostPost }) {
  const video = extractVideo(post.html)
  return (
    <article className="group py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
      <Link href={`/${post.slug}`} className="flex gap-4">
        {(video || post.feature_image) && (
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm">
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
                sizes="72px"
                className="object-cover"
              />
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-heading text-sm font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
            {post.title}
          </h3>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-text-caption">
            {formatReadingTime(post.reading_time)}
          </span>
        </div>
      </Link>
    </article>
  )
}
