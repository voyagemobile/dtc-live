import type { GhostPost } from '@/lib/types'
import { ArticleCard } from '@/components/article/article-card'
import { Container } from '@/components/ui/container'

interface RelatedArticlesProps {
  posts: GhostPost[]
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border py-16" aria-labelledby="related-articles-heading">
      <Container>
        <h2
          id="related-articles-heading"
          className="font-heading text-2xl font-bold text-text-headline lg:text-3xl"
        >
          Related Articles
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      </Container>
    </section>
  )
}
