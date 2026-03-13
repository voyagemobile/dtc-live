import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface CategorySectionProps {
  title: string
  slug: string
  posts: GhostPost[]
}

/**
 * Category section: all cards use overlay style (image + gradient + white text)
 * so text is always readable regardless of the underlying image brightness.
 */
export function CategorySection({ title, slug, posts }: CategorySectionProps) {
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

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
            className="text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-150 hover:text-primary-hover"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Lead card: tall overlay */}
          {lead && (
            <article className="group lg:row-span-2">
              <Link href={`/${lead.slug}`} className="relative block h-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg lg:h-full lg:min-h-[420px]">
                  {(() => {
                    const video = extractVideo(lead.html)
                    return video ? (
                      <video
                        src={video.src}
                        poster={video.thumbnail || lead.feature_image || undefined}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : lead.feature_image ? (
                      <Image
                        src={lead.feature_image}
                        alt={lead.feature_image_alt || lead.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-surface" />
                    )
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  <div className="absolute inset-0 flex items-end p-5">
                    <div>
                      <span className="mb-2 inline-block rounded-sm bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        {title}
                      </span>
                      <h3 className="font-heading text-lg font-bold leading-snug text-white lg:text-xl">
                        {lead.title}
                      </h3>
                      <span className="mt-2 block text-[11px] uppercase tracking-wider text-white/60">
                        {lead.published_at && formatDate(lead.published_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Side cards: overlay style so text is always white on gradient */}
          {rest.slice(0, 2).map((post) => (
            <OverlayCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OverlayCard({ post }: { post: GhostPost }) {
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group">
      <Link href={href} className="relative block overflow-hidden rounded-lg">
        <div className="relative aspect-[16/9] w-full">
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
              src={post.feature_image!}
              alt={post.feature_image_alt || post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex items-end p-4">
            <div>
              {post.primary_tag && (
                <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                  {post.primary_tag.name}
                </span>
              )}
              <h3 className="font-heading text-base font-bold leading-snug text-white transition-colors duration-150 group-hover:text-primary lg:text-lg">
                {post.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                {post.published_at && (
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                )}
                <span aria-hidden="true">&middot;</span>
                <span>{formatReadingTime(post.reading_time)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
