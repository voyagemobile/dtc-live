import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getPostsByTag } from '@/lib/ghost'
import { formatDate, formatReadingTime } from '@/lib/format'
import { extractVideo, stripVideoCards } from '@/lib/video'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/ui/container'
import { ArticleContent } from '@/components/article/article-content'
import { AuthorCard } from '@/components/article/author-card'
import { RelatedArticles } from '@/components/article/related-articles'
import { ShareButtons } from '@/components/article/share-buttons'

export const revalidate = 300

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Article Not Found' }
  }

  const title = post.meta_title || post.title
  const description =
    post.meta_description || post.custom_excerpt || post.excerpt || ''
  const ogImage = post.og_image || post.feature_image
  const ogTitle = post.og_title || title
  const ogDescription = post.og_description || description

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.authors.map((a) => a.name),
      tags: post.tags.map((t) => t.name),
      ...(ogImage && {
        images: [{ url: ogImage, alt: post.feature_image_alt || title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitter_title || title,
      description: post.twitter_description || description,
      ...(post.twitter_image || ogImage
        ? { images: [post.twitter_image || ogImage!] }
        : {}),
    },
    ...(post.canonical_url && { alternates: { canonical: post.canonical_url } }),
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Fetch related articles in parallel (same primary tag, exclude current post)
  const relatedPosts = post.primary_tag
    ? await getPostsByTag(post.primary_tag.slug, { limit: 4 }).then((res) =>
        res.posts.filter((p) => p.id !== post.id).slice(0, 3)
      )
    : []

  const primaryAuthor = post.primary_author || post.authors[0] || null

  // Extract video from Ghost HTML (5s animated feature videos)
  const video = extractVideo(post.html)
  // Strip the kg-video-card from body so it doesn't render twice
  const cleanHtml = video ? stripVideoCards(post.html) : (post.html ?? '')

  // Structured data for article
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'
  const articleUrl = `${siteUrl}/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.title,
    description: post.custom_excerpt || post.excerpt || '',
    url: articleUrl,
    image: post.feature_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: post.authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      ...(a.profile_image && { image: a.profile_image }),
      ...(a.website && { url: a.website }),
    })),
    publisher: {
      '@type': 'Organization',
      name: 'DTC Live',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Feature Banner: video (autoplay loop) or static image */}
        {(video || post.feature_image) && (
          <Container size="narrow" className="pt-8">
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-surface">
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
              ) : (
                <Image
                  src={post.feature_image!}
                  alt={post.feature_image_alt || post.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </Container>
        )}

        {/* Article Header + Content */}
        <Container size="narrow" className="pt-10 pb-4">
          {/* Category Badge */}
          {post.primary_tag && (
            <div className="mb-4">
              <Link href={`/category/${post.primary_tag.slug}`}>
                <Badge variant="primary" size="md">
                  {post.primary_tag.name}
                </Badge>
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl font-bold leading-tight text-text-headline sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {post.title}
          </h1>

          {/* Article Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            {primaryAuthor && (
              <>
                {primaryAuthor.profile_image && (
                  <Link
                    href={`/author/${primaryAuthor.slug}`}
                    className="shrink-0"
                    aria-label={`View posts by ${primaryAuthor.name}`}
                  >
                    <Image
                      src={primaryAuthor.profile_image}
                      alt={primaryAuthor.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  </Link>
                )}
                <Link
                  href={`/author/${primaryAuthor.slug}`}
                  className="font-medium text-text-headline transition-colors duration-150 hover:text-primary"
                >
                  {primaryAuthor.name}
                </Link>
                <span aria-hidden="true" className="text-border">
                  &middot;
                </span>
              </>
            )}
            {post.published_at && (
              <>
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
                <span aria-hidden="true" className="text-border">
                  &middot;
                </span>
              </>
            )}
            <span>{formatReadingTime(post.reading_time)}</span>
          </div>

          {/* Feature Image Caption */}
          {post.feature_image_caption && (
            <p
              className="mt-4 text-sm text-text-caption"
              dangerouslySetInnerHTML={{ __html: post.feature_image_caption }}
            />
          )}

          {/* Article Body */}
          <div className="mt-10">
            {cleanHtml && <ArticleContent html={cleanHtml} />}
          </div>

          {/* Share Buttons */}
          <ShareButtons title={post.title} slug={post.slug} />

          {/* Author Card */}
          {primaryAuthor && <AuthorCard author={primaryAuthor} />}
        </Container>
      </article>

      {/* Related Articles */}
      <RelatedArticles posts={relatedPosts} />
    </>
  )
}
