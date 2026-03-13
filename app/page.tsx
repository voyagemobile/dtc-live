import { Suspense } from 'react'
import { getPosts, getPostsByTag } from '@/lib/ghost'
import type { GhostPost } from '@/lib/types'
import { HeroArticle } from '@/components/home/hero-article'
import { FeaturedGrid } from '@/components/home/featured-grid'
import { LatestFeed } from '@/components/home/latest-feed'
import { CategorySection } from '@/components/home/category-section'
import { NewsletterCTA } from '@/components/home/newsletter-cta'
import { SponsorBanner } from '@/components/home/sponsor-banner'
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
// ---------------------------------------------------------------------------

/**
 * Cinematic hero: latest post as full-bleed video/image with headline overlay,
 * plus 4 secondary story cards in a row beneath.
 */
async function HeroSection() {
  try {
    const response = await getPosts({ limit: 8 })
    const posts = response.posts
    if (posts.length === 0) return null

    const heroPost = posts[0]
    const secondaryPosts = posts.slice(1, 5)

    return <HeroArticle post={heroPost} secondaryPosts={secondaryPosts} />
  } catch {
    return null
  }
}

/**
 * Editor's Picks: asymmetric grid with 1 large + 2 stacked.
 * Uses posts 5-7 (after hero uses 0-4).
 */
async function FeaturedSection() {
  try {
    const response = await getPosts({ limit: 8 })
    const gridPosts = response.posts.slice(5, 8)
    if (gridPosts.length === 0) return null
    return <FeaturedGrid posts={gridPosts} />
  } catch {
    return null
  }
}

/**
 * Latest feed: text-heavy list with thumbnails + "Most Read" sidebar.
 * Fetches separately to get a fresh set beyond what hero/featured use.
 */
async function LatestSection() {
  try {
    const response = await getPosts({ limit: 15 })
    // Skip the first 8 posts already used by hero + featured
    const latestPosts = response.posts.slice(8)
    if (latestPosts.length === 0) return null
    return <LatestFeed posts={latestPosts} />
  } catch {
    return null
  }
}

async function CategorySections() {
  try {
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
      {/* Cinematic hero with secondary story bar */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Editor's Picks: asymmetric grid */}
      <Suspense fallback={<FeaturedGridSkeleton />}>
        <FeaturedSection />
      </Suspense>

      {/* Newsletter CTA: bold dark band */}
      <NewsletterCTA />

      {/* Latest articles feed */}
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
