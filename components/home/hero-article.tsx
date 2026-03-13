import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { extractVideo } from '@/lib/video'
import { HeroExpand } from '@/components/home/hero-expand'

interface HeroArticleProps {
  post: GhostPost
  secondaryPosts?: GhostPost[]
  allPosts?: GhostPost[]
}

/**
 * Hero with scroll-to-expand featured article image,
 * followed by a trending stories strip below.
 */
export function HeroArticle({ post, secondaryPosts = [], allPosts = [] }: HeroArticleProps) {
  return (
    <section>
      {/* ── Scroll-expand hero ── */}
      <HeroExpand post={post} />

      {/* ── Trending strip ── */}
      {secondaryPosts.length > 0 && (
        <div className="border-t border-b border-border bg-surface/40">
          <div className="mx-auto max-w-[1280px] px-5">
            <div className="flex items-center gap-2 py-3">
              <svg className="h-3.5 w-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-headline">
                Trending
              </span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
              {secondaryPosts.slice(0, 4).map((p) => (
                <TrendingItem key={p.id} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function TrendingItem({ post }: { post: GhostPost }) {
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <Link href={href} className="group flex gap-3 py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0">
      {(video || post.feature_image) && (
        <div className="relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded">
          {video ? (
            <video
              src={video.src}
              poster={video.thumbnail || post.feature_image || undefined}
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={post.feature_image!}
              alt={post.feature_image_alt || post.title}
              fill
              sizes="76px"
              className="object-cover"
            />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        {post.primary_tag && (
          <span className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.primary_tag.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
