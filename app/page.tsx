import { getPosts, getPostsByTag } from '@/lib/ghost'
import type { GhostPost } from '@/lib/types'
import { HeroArticle } from '@/components/home/hero-article'
import { FeaturedGrid } from '@/components/home/featured-grid'
import { LatestFeed } from '@/components/home/latest-feed'
import { CategorySection } from '@/components/home/category-section'
import { NewsletterCTA } from '@/components/home/newsletter-cta'
import { SponsorBanner } from '@/components/home/sponsor-banner'

// ---------------------------------------------------------------------------
// Categories displayed as homepage sections
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { title: 'Industry', slug: 'industry' },
  { title: 'Strategies', slug: 'strategies' },
  { title: 'Analysis', slug: 'analysis' },
] as const

// ---------------------------------------------------------------------------
// Page component — single data fetch, no duplicates
// ---------------------------------------------------------------------------

export default async function Home() {
  // Single fetch: get enough posts for all sections
  const [mainResponse, ...categoryResults] = await Promise.all([
    getPosts({ limit: 20 }),
    ...CATEGORIES.map((cat) => getPostsByTag(cat.slug, { limit: 6 })),
  ])

  const allPosts = mainResponse.posts

  // Distribute posts across sections — each post appears exactly once
  const heroPost = allPosts[0] ?? null
  const secondaryPosts = allPosts.slice(1, 5)
  const featuredPosts = allPosts.slice(5, 8)
  const latestPosts = allPosts.slice(8, 16)

  // Track all IDs used in main sections
  const usedIds = new Set(allPosts.slice(0, 16).map((p) => p.id))

  // Filter category posts to exclude anything already shown
  const categoryData = CATEGORIES.map((cat, i) => ({
    ...cat,
    posts: categoryResults[i].posts
      .filter((p: GhostPost) => !usedIds.has(p.id))
      .slice(0, 3),
  }))

  return (
    <>
      {/* 1. Full-bleed hero with trending bar */}
      {heroPost && (
        <HeroArticle post={heroPost} secondaryPosts={secondaryPosts} allPosts={allPosts} />
      )}

      {/* 2. Editor's Picks: bold overlay + side cards */}
      {featuredPosts.length > 0 && <FeaturedGrid posts={featuredPosts} />}

      {/* 3. Newsletter CTA banner */}
      <NewsletterCTA />

      {/* 4. Latest: numbered ranking + Most Read sidebar */}
      {latestPosts.length > 0 && <LatestFeed posts={latestPosts} />}

      {/* 5. LiveRecover sponsor banner */}
      <SponsorBanner />

      {/* 6. Category sections */}
      {categoryData.map((cat) =>
        cat.posts.length > 0 ? (
          <CategorySection
            key={cat.slug}
            title={cat.title}
            slug={cat.slug}
            posts={cat.posts}
          />
        ) : null
      )}
    </>
  )
}
