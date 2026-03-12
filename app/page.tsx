import { Suspense } from 'react'
import { getFeaturedPosts, getPosts, getPostsByTag } from '@/lib/ghost'
import type { GhostPost } from '@/lib/types'
import { HeroArticle } from '@/components/home/hero-article'
import { FeaturedGrid } from '@/components/home/featured-grid'
import { LatestFeed } from '@/components/home/latest-feed'
import { CategorySection } from '@/components/home/category-section'
import {
  HeroSkeleton,
  FeaturedGridSkeleton,
  LatestFeedSkeleton,
  CategorySectionSkeleton,
} from '@/components/article/article-card-skeleton'

// ---------------------------------------------------------------------------
// Categories displayed as homepage sections
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { title: 'Industry', slug: 'industry' },
  { title: 'Strategies', slug: 'strategies' },
  { title: 'Analysis', slug: 'analysis' },
] as const

// ---------------------------------------------------------------------------
// Async data-fetching components (streamed via Suspense)
//
// Each section catches fetch errors so the page degrades gracefully
// when Ghost is unreachable or the API key is not yet configured.
// ---------------------------------------------------------------------------

async function HeroSection() {
  try {
    const featured = await getFeaturedPosts(1)
    const heroPost = featured[0]
    if (!heroPost) return null
    return <HeroArticle post={heroPost} />
  } catch {
    return null
  }
}

async function FeaturedSection() {
  try {
    const featured = await getFeaturedPosts(4)
    // Skip the first post (used by hero)
    const gridPosts = featured.slice(1)
    if (gridPosts.length === 0) return null
    return <FeaturedGrid posts={gridPosts} />
  } catch {
    return null
  }
}

async function LatestSection() {
  try {
    // Fetch featured IDs to exclude the hero post from the latest feed
    const [featured, latestResponse] = await Promise.all([
      getFeaturedPosts(1),
      getPosts({ limit: 10 }),
    ])

    const heroId = featured[0]?.id
    const latestPosts = latestResponse.posts.filter(
      (post: GhostPost) => post.id !== heroId
    )

    if (latestPosts.length === 0) return null
    return <LatestFeed posts={latestPosts.slice(0, 8)} />
  } catch {
    return null
  }
}

async function CategorySections() {
  try {
    // Fetch all categories in parallel
    const results = await Promise.all(
      CATEGORIES.map((cat) => getPostsByTag(cat.slug, { limit: 3 }))
    )

    return (
      <>
        {CATEGORIES.map((cat, i) => {
          const posts = results[i].posts
          if (posts.length === 0) return null
          return (
            <CategorySection
              key={cat.slug}
              title={cat.title}
              slug={cat.slug}
              posts={posts}
            />
          )
        })}
      </>
    )
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <>
      {/* Hero: full-width featured article */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Featured grid: asymmetric editorial layout */}
      <Suspense fallback={<FeaturedGridSkeleton />}>
        <FeaturedSection />
      </Suspense>

      {/* Latest articles: chronological feed */}
      <Suspense fallback={<LatestFeedSkeleton />}>
        <LatestSection />
      </Suspense>

      {/* Category sections: Industry, Strategies, Analysis */}
      <Suspense fallback={
        <div className="space-y-12">
          <CategorySectionSkeleton />
          <CategorySectionSkeleton />
          <CategorySectionSkeleton />
        </div>
      }>
        <CategorySections />
      </Suspense>
    </>
  )
}
