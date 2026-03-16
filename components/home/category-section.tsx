import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'
import { AutoPlayVideo } from '@/components/ui/autoplay-video'

interface CategorySectionProps {
  title: string
  slug: string
  posts: GhostPost[]
}

/**
 * Category section: simple 3-column grid. Every card has the image on top
 * and text below on a white background. No overlay text on images, ever.
 * Text is always black on white = always readable.
 */
export function CategorySection({ title, slug, posts }: CategorySectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-10">
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-headline">
              {title}
            </h2>
          </div>
          <Link
            href={`/category/${slug}`}
            className="py-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-150 hover:text-primary-hover"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <CategoryCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group">
      <Link href={href} className="block">
        {(video || post.feature_image) && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface">
            {video ? (
              <AutoPlayVideo
                src={video.src}
                poster={video.thumbnail || post.feature_image || undefined}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={post.feature_image!}
                alt={post.feature_image_alt || post.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        )}
      </Link>
      <div className="mt-3">
        {post.primary_tag && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <Link href={href}>
          <h3 className="mt-1 font-heading text-base font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary lg:text-lg">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {excerpt}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-text-caption">
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
          <span aria-hidden="true">&middot;</span>
          <span>{formatReadingTime(post.reading_time)}</span>
        </div>
      </div>
    </article>
  )
}
