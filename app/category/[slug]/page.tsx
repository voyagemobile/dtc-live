import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTagBySlug, getPostsByTag } from '@/lib/ghost'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo } from '@/lib/video'
import type { GhostPost } from '@/lib/types'
import { Container } from '@/components/ui/container'
import { ArticleGrid } from '@/components/article/article-grid'
import { Pagination } from '@/components/ui/pagination'
import { NewsletterCTA } from '@/components/home/newsletter-cta'

export const revalidate = 300

// ---------------------------------------------------------------------------
// Static params
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

  return {
    title: `${tag.name} | DTC Live`,
    description:
      tag.description ?? `Browse ${tag.name} articles on DTC Live`,
    alternates: {
      canonical: `${siteUrl}/category/${slug}`,
    },
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

  const tag = await getTagBySlug(slug)

  // If the tag doesn't exist in Ghost yet, show a coming-soon placeholder
  if (!tag) {
    const friendlyName = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    return (
      <>
        <div className="border-b border-border bg-surface/50">
          <Container className="py-10 sm:py-14">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h1 className="font-heading text-4xl font-bold leading-tight text-text-headline sm:text-5xl">
                {friendlyName}
              </h1>
            </div>
          </Container>
        </div>
        <Container className="py-16 text-center">
          <p className="text-lg text-text-muted">
            We&rsquo;re curating the best content for this section. Check back soon!
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            Back to Home
          </Link>
        </Container>
      </>
    )
  }

  const postsData = await getPostsByTag(slug, { limit: POSTS_PER_PAGE, page: currentPage })
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
        name: tag.name,
        item: `${siteUrl}/category/${slug}`,
      },
    ],
  }

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

  // On page 1, pull the first post as a featured lead
  const isFirstPage = currentPage === 1
  const leadPost = isFirstPage ? posts[0] : null
  const gridPosts = isFirstPage ? posts.slice(1) : posts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Category header with pink accent */}
      <div className="border-b border-border bg-surface/50">
        <Container className="py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h1 className="font-heading text-4xl font-bold leading-tight text-text-headline sm:text-5xl">
              {tag.name}
            </h1>
          </div>
          {tag.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
              {tag.description}
            </p>
          )}
          <p className="mt-3 text-sm text-text-caption">
            {total === 1 ? '1 article' : `${total} articles`}
          </p>
        </Container>
      </div>

      {/* Featured lead article (page 1 only) */}
      {leadPost && <CategoryLead post={leadPost} />}

      {/* Article grid */}
      <Container className="py-10">
        <ArticleGrid posts={gridPosts} />

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

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </>
  )
}

// ---------------------------------------------------------------------------
// Featured lead article
// ---------------------------------------------------------------------------

function CategoryLead({ post }: { post: GhostPost }) {
  const excerpt = post.custom_excerpt || post.excerpt || ''
  const href = `/${post.slug}`
  const video = extractVideo(post.html)

  return (
    <div className="border-b border-border">
      <Container className="py-8">
        <article className="group grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <Link href={href} className="block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm">
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
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 bg-surface" />
              )}
            </div>
          </Link>

          <div className="flex flex-col justify-center">
            {post.primary_tag && (
              <span className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
                {post.primary_tag.name}
              </span>
            )}
            <Link href={href} className="group">
              <h2 className="font-heading text-2xl font-bold leading-tight text-text-headline transition-colors duration-150 group-hover:text-primary sm:text-3xl lg:text-4xl">
                {post.title}
              </h2>
            </Link>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-text-muted lg:text-lg">
              {excerpt}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider text-text-caption">
              {post.primary_author && (
                <>
                  <span className="font-medium text-text-headline">{post.primary_author.name}</span>
                  <span aria-hidden="true">&middot;</span>
                </>
              )}
              {post.published_at && (
                <>
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  <span aria-hidden="true">&middot;</span>
                </>
              )}
              <span>{formatReadingTime(post.reading_time)}</span>
            </div>
          </div>
        </article>
      </Container>
    </div>
  )
}
