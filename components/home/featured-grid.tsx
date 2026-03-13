import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface FeaturedGridProps {
  posts: GhostPost[]
}

/**
 * NYT-style secondary story row.
 * Each story gets an image + headline + excerpt in a clean horizontal layout
 * separated by thin vertical dividers. Below the hero section.
 */
export function FeaturedGrid({ posts }: FeaturedGridProps) {
  if (posts.length === 0) return null

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:divide-x sm:divide-border lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <StoryCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryCard({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group px-0 py-4 first:pl-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0 border-b border-border last:border-b-0 sm:border-b-0">
      <Link href={href} className="block">
        {(video || post.feature_image) && (
          <div className="relative mb-3 aspect-[3/2] w-full overflow-hidden">
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
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            )}
          </div>
        )}
        <h3 className="font-heading text-lg font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
          {post.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
        {excerpt}
      </p>
      <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
        {post.published_at && (
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        )}
        <span aria-hidden="true">&middot;</span>
        <span>{formatReadingTime(post.reading_time)}</span>
      </div>
    </article>
  )
}
