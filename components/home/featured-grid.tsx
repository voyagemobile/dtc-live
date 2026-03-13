import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'

interface FeaturedGridProps {
  posts: GhostPost[]
}

/**
 * Editor's Picks: bold lead card with overlay headline (mini cover),
 * two side cards with prominent thumbnails. Feels like a different
 * rhythm from the hero and latest sections.
 */
export function FeaturedGrid({ posts }: FeaturedGridProps) {
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-10">
        {/* Section label with pink accent */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-headline">
            Editor&rsquo;s Picks
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:grid-rows-1">
          {/* Lead story: large card with overlay */}
          {lead && <LeadCard post={lead} />}

          {/* Side cards: fill full height, split evenly */}
          {rest.length > 0 && (
            <div className="grid grid-rows-2 gap-5 lg:col-span-2">
              {rest.slice(0, 2).map((post) => (
                <SideCard key={post.id} post={post} />
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
    <article className="group lg:col-span-3">
      <Link href={href} className="relative block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:aspect-[3/2]">
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
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}
          {/* Gradient + text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              {post.primary_tag && (
                <span className="mb-2 inline-block rounded-sm bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  {post.primary_tag.name}
                </span>
              )}
              <h3
                className="font-heading text-xl font-bold leading-snug lg:text-2xl"
                style={{ color: '#ffffff' }}
              >
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                {excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

function SideCard({ post }: { post: GhostPost }) {
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <article className="group">
      <Link href={href} className="relative block h-full overflow-hidden rounded-lg">
        <div className="relative h-full min-h-[200px] w-full">
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
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}
          {/* Gradient + text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end p-5">
            <div>
              {post.primary_tag && (
                <span className="mb-1.5 inline-block rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  {post.primary_tag.name}
                </span>
              )}
              <h3
                className="font-heading text-base font-bold leading-snug lg:text-lg"
                style={{ color: '#ffffff' }}
              >
                {post.title}
              </h3>
              <span className="mt-1.5 block text-[11px] uppercase tracking-wider text-white/60">
                {formatReadingTime(post.reading_time)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
