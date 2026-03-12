import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { formatReadingTime } from '@/lib/format'
import { Container } from '@/components/ui/container'
import { ArticleCard } from '@/components/article/article-card'

interface LatestFeedProps {
  posts: GhostPost[]
}

/**
 * Chronological feed of the most recent articles.
 * Horizontal "compact" cards separated by dividers, giving a newsfeed feel.
 */
export function LatestFeed({ posts }: LatestFeedProps) {
  if (posts.length === 0) return null

  return (
    <section className="bg-surface py-12 lg:py-16">
      <Container size="wide">
        {/* Section heading */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-text-headline lg:text-3xl">
            Latest
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        {/* Two-column layout on desktop: feed left, sidebar-style right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main feed */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="py-6 first:pt-0 last:pb-0">
                  <ArticleCard post={post} variant="compact" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar with top 3 as standard cards on desktop */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24">
              <h3 className="mb-6 font-heading text-lg font-bold text-text-headline">
                Trending
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 3).map((post, i) => (
                  <div key={post.id}>
                    <div className="flex gap-4">
                      <span className="font-heading text-3xl font-bold text-border">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <Link href={`/${post.slug}`} className="group">
                          <h4 className="font-heading text-sm font-bold leading-snug text-text-headline transition-colors duration-150 group-hover:text-primary">
                            {post.title}
                          </h4>
                        </Link>
                        <p className="mt-1 text-xs text-text-caption">
                          {formatReadingTime(post.reading_time)}
                        </p>
                      </div>
                    </div>
                    {i < 2 && <div className="mt-4 border-t border-border" />}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
