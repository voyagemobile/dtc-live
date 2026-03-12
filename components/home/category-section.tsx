import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { Container } from '@/components/ui/container'
import { ArticleCard } from '@/components/article/article-card'

interface CategorySectionProps {
  title: string
  slug: string
  posts: GhostPost[]
}

/**
 * A row of 3 articles for a single category, with a "View All" link.
 * Used for Industry, Strategies, and Analysis sections on the homepage.
 */
export function CategorySection({ title, slug, posts }: CategorySectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-12 lg:py-16">
      <Container size="wide">
        {/* Section header with accent border */}
        <div className="mb-8 flex items-end justify-between border-b-2 border-primary pb-3">
          <h2 className="font-heading text-2xl font-bold text-text-headline lg:text-3xl">
            {title}
          </h2>
          <Link
            href={`/category/${slug}`}
            className="text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-hover"
          >
            View All &rarr;
          </Link>
        </div>

        {/* 3-column grid, falling back to stacked on mobile */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <ArticleCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      </Container>
    </section>
  )
}
