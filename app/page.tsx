import { getPosts, getPostsByTag, getFeaturedPosts } from '@/lib/ghost'
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
  // Fetch posts + Ghost-featured posts + category posts in parallel
  const [mainResponse, ghostFeatured, ...categoryResults] = await Promise.all([
    getPosts({ limit: 20 }),
    getFeaturedPosts(4),
    ...CATEGORIES.map((cat) => getPostsByTag(cat.slug, { limit: 6 })),
  ])

  const allPosts = mainResponse.posts

  // Distribute posts across sections
  const heroPost = allPosts[0] ?? null
  const secondaryPosts = allPosts.slice(1, 5)

  // Editor's Picks: lead card = most recent post, side cards = Ghost featured
  const usedInUpperSections = new Set(allPosts.slice(0, 5).map((p) => p.id))

  const editorsPicks: GhostPost[] = []
  // Lead card: always the most recent article
  if (heroPost) editorsPicks.push(heroPost)
  // Side cards: Ghost-featured posts not already used above
  for (const fp of ghostFeatured) {
    if (editorsPicks.length >= 3) break
    if (!usedInUpperSections.has(fp.id) && !editorsPicks.some((p) => p.id === fp.id)) {
      editorsPicks.push(fp)
    }
  }
  // Backfill if not enough featured posts
  for (const p of allPosts.slice(5)) {
    if (editorsPicks.length >= 3) break
    if (!usedInUpperSections.has(p.id) && !editorsPicks.some((ep) => ep.id === p.id)) {
      editorsPicks.push(p)
    }
  }

  const featuredPosts = editorsPicks

  // Track all IDs used in main sections
  const usedIds = new Set([
    ...allPosts.slice(0, 5).map((p) => p.id),
    ...featuredPosts.map((p) => p.id),
  ])

  // Latest: first 8 unused posts
  const latestPosts = allPosts.filter((p) => !usedIds.has(p.id)).slice(0, 8)
  // Add latest to used set for category dedup
  latestPosts.forEach((p) => usedIds.add(p.id))

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
