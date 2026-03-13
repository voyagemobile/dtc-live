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
 * Editorial front-page hero: 5-post grid with one dominant story and
 * four supporting stories. The lead article takes 2/3 width with a large
 * image; secondary stories stack in a tight column on the right.
 * A "Now Trending" label anchors the top.
 */
export function HeroArticle({ post, secondaryPosts = [] }: HeroArticleProps) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* ── Lead story ── */}
          <article className="group">
            <Link href={href} className="block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
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
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface" />
                )}
              </div>
            </Link>
            <div className="mt-5">
              {post.primary_tag && (
                <span className="mb-2 inline-block rounded-sm bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                  {post.primary_tag.name}
                </span>
              )}
              <Link href={href} className="group">
                <h1 className="font-heading text-2xl font-bold leading-[1.15] text-text-headline transition-colors duration-150 group-hover:text-primary sm:text-3xl lg:text-4xl">
                  {post.title}
                </h1>
              </Link>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                {excerpt}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
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
            </div>
          </article>

          {/* ── Secondary stories column ── */}
          {secondaryPosts.length > 0 && (
            <div className="flex flex-col divide-y divide-border border-t border-border pt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {secondaryPosts.slice(0, 4).map((p) => (
                <SideStory key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SideStory({ post }: { post: GhostPost }) {
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group flex gap-4 py-5 first:pt-0">
      {/* Thumbnail */}
      {(video || post.feature_image) && (
        <Link href={href} className="relative shrink-0">
          <div className="relative h-[80px] w-[110px] overflow-hidden rounded-md">
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
                sizes="110px"
                className="object-cover"
              />
            )}
          </div>
        </Link>
      )}
      {/* Text */}
      <div className="flex flex-1 flex-col justify-center">
        {post.primary_tag && (
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <Link href={href}>
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        <span className="mt-1 text-[10px] uppercase tracking-wider text-text-caption">
          {post.published_at && formatDate(post.published_at)}
        </span>
      </div>
    </article>
  )
}
