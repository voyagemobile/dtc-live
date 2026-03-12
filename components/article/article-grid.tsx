import type { GhostPost } from '@/lib/types'
import { ArticleCard } from '@/components/article/article-card'

interface ArticleGridProps {
  posts: GhostPost[]
  className?: string
}

/**
 * Reusable server component grid of ArticleCards.
 * Renders in a responsive 1/2/3 column layout (mobile/tablet/desktop).
 */
export function ArticleGrid({ posts, className = '' }: ArticleGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted">No articles found.</p>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {posts.map((post) => (
        <ArticleCard
          key={post.id}
          post={post}
          variant="standard"
          priority={false}
        />
      ))}
    </div>
  )
}
