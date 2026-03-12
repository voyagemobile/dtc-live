import type { GhostPost } from '@/lib/types'
import { Container } from '@/components/ui/container'
import { ArticleCard } from '@/components/article/article-card'

interface FeaturedGridProps {
  posts: GhostPost[]
}

/**
 * Asymmetric editorial grid for featured articles.
 *
 * Layout (desktop):
 * - Left column (7/12): one large "featured" card
 * - Right column (5/12): two stacked "standard" cards
 *
 * If only 2 posts are available, the right column shows one card.
 * If only 1 post, it takes the full width.
 */
export function FeaturedGrid({ posts }: FeaturedGridProps) {
  if (posts.length === 0) return null

  const primary = posts[0]
  const secondary = posts.slice(1, 3)

  return (
    <section className="py-12 lg:py-16">
      <Container size="wide">
        {/* Section heading */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-text-headline lg:text-3xl">
            Featured
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Primary (large) card */}
          <div className="lg:col-span-7">
            <ArticleCard post={primary} variant="featured" />
          </div>

          {/* Secondary (stacked) cards */}
          {secondary.length > 0 && (
            <div className="flex flex-col gap-8 lg:col-span-5">
              {secondary.map((post) => (
                <ArticleCard key={post.id} post={post} variant="standard" />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
