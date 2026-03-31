import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getPostsByAuthor, getAuthors } from '@/lib/ghost'
import { Container } from '@/components/ui/container'
import { ArticleGrid } from '@/components/article/article-grid'
import { Pagination } from '@/components/ui/pagination'

export const revalidate = 300

// ---------------------------------------------------------------------------
// Static params — pre-generate all author slugs at build time
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({ slug: author.slug }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface AuthorPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return { title: 'Author Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

  const description = author.bio ?? `Browse articles by ${author.name} on DTC Live`

  return {
    title: `${author.name} | DTC Live`,
    description,
    openGraph: {
      type: 'profile',
      title: `${author.name} | DTC Live`,
      description,
      url: `${siteUrl}/author/${slug}`,
      ...(author.profile_image && {
        images: [{ url: author.profile_image, alt: author.name }],
      }),
    },
    twitter: {
      card: 'summary',
      title: `${author.name} | DTC Live`,
      description,
      ...(author.profile_image && { images: [author.profile_image] }),
    },
    alternates: {
      canonical: `${siteUrl}/author/${slug}`,
    },
  }
}

// ---------------------------------------------------------------------------
// Author avatar with initials fallback
// ---------------------------------------------------------------------------

function AuthorInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-surface text-2xl font-bold text-text-muted"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const POSTS_PER_PAGE = 15

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams

  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [author, postsData] = await Promise.all([
    getAuthorBySlug(slug),
    getPostsByAuthor(slug, { limit: POSTS_PER_PAGE, page: currentPage }),
  ])

  if (!author) {
    notFound()
  }

  const { posts, meta } = postsData
  const { pages: totalPages, total } = meta.pagination

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: author.name,
        item: `${siteUrl}/author/${slug}`,
      },
    ],
  }

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${siteUrl}/author/${slug}`,
    ...(author.bio && { description: author.bio }),
    ...(author.profile_image && { image: author.profile_image }),
    ...(author.website && { sameAs: [author.website] }),
    worksFor: {
      '@type': 'Organization',
      name: 'DTC Live',
      url: siteUrl,
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
    />
    <Container className="py-10 sm:py-14">
      {/* Author header */}
      <header className="mb-10 border-b border-border pb-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          {author.profile_image ? (
            <Image
              src={author.profile_image}
              alt=""
              width={96}
              height={96}
              className="shrink-0 rounded-full object-cover"
              priority
            />
          ) : (
            <AuthorInitials name={author.name} />
          )}

          {/* Author info */}
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-4xl font-bold leading-tight text-text-headline sm:text-5xl">
              {author.name}
            </h1>

            {author.bio && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
                {author.bio}
              </p>
            )}

            {author.location && (
              <p className="mt-2 text-sm text-text-caption">{author.location}</p>
            )}

            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${author.name}'s website (opens in new tab)`}
                className="mt-2 inline-block text-sm text-text-caption transition-colors duration-150 hover:text-primary"
              >
                {author.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}

            <p className="mt-3 text-sm text-text-caption">
              {total === 1 ? '1 article' : `${total} articles`}
            </p>
          </div>
        </div>
      </header>

      {/* Article grid */}
      <ArticleGrid posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/author/${slug}`}
          />
        </div>
      )}
    </Container>
    </>
  )
}
