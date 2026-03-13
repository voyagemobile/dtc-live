import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTagBySlug, getPostsByTag } from '@/lib/ghost'
import { Container } from '@/components/ui/container'
import { ArticleGrid } from '@/components/article/article-grid'
import { Pagination } from '@/components/ui/pagination'

export const revalidate = 300

// ---------------------------------------------------------------------------
// Static params — pre-generate the 4 main categories at build time
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return [
    { slug: 'industry' },
    { slug: 'strategies' },
    { slug: 'analysis' },
    { slug: 'top-dtc-brands' },
  ]
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)

  if (!tag) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${tag.name} | DTC Live`,
    description:
      tag.description ?? `Browse ${tag.name} articles on DTC Live`,
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const POSTS_PER_PAGE = 15

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams

  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [tag, postsData] = await Promise.all([
    getTagBySlug(slug),
    getPostsByTag(slug, { limit: POSTS_PER_PAGE, page: currentPage }),
  ])

  if (!tag) {
    notFound()
  }

  const { posts, meta } = postsData
  const { pages: totalPages, total } = meta.pagination

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: tag.name,
    description: tag.description ?? `Browse ${tag.name} articles on DTC Live`,
    url: `${siteUrl}/category/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'DTC Live',
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-10 sm:py-14">
      {/* Category header */}
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="font-heading text-4xl font-bold leading-tight text-text-headline sm:text-5xl">
          {tag.name}
        </h1>
        {tag.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            {tag.description}
          </p>
        )}
        <p className="mt-3 text-sm text-text-caption">
          {total === 1 ? '1 article' : `${total} articles`}
        </p>
      </header>

      {/* Article grid */}
      <ArticleGrid posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${slug}`}
          />
        </div>
      )}
    </Container>
    </>
  )
}
