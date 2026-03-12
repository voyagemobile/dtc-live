import { Logo } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'
import { HeaderClient } from '@/components/layout/header-client'
import { getPosts } from '@/lib/ghost'
import type { NavCategory } from '@/components/nav/mega-menu'

/**
 * Category definitions with editorial descriptions.
 * Shared between mega menu and mobile menu via serializable props.
 */
const categories: NavCategory[] = [
  {
    label: 'Industry',
    slug: 'industry',
    href: '/category/industry',
    description:
      'Trends, news, and insights shaping direct-to-consumer commerce.',
  },
  {
    label: 'Strategies',
    slug: 'strategies',
    href: '/category/strategies',
    description:
      'Playbooks and tactics from the best DTC operators.',
  },
  {
    label: 'Analysis',
    slug: 'analysis',
    href: '/category/analysis',
    description:
      'Deep dives into DTC performance, markets, and data.',
  },
  {
    label: 'Top DTC Brands',
    slug: 'top-dtc-brands',
    href: '/category/top-dtc-brands',
    description:
      'Profiles of the brands defining the DTC landscape.',
  },
]

/**
 * Server Component header.
 *
 * Fetches the latest posts at the server layer (React.cache-deduplicated,
 * ISR-revalidated) and passes them as serializable props to the interactive
 * client shell. The mega menu and mobile menu are lazy-loaded via next/dynamic
 * inside HeaderClient to stay out of the initial JS bundle.
 */
export async function Header() {
  // Fetch the most recent posts for the trending sidebar.
  // Wrapped in try/catch so the header still renders if Ghost is unreachable.
  let trendingPosts: Awaited<ReturnType<typeof getPosts>>['posts'] = []
  try {
    const response = await getPosts({ limit: 8 })
    trendingPosts = response.posts
  } catch {
    // Silently degrade: header renders without trending data.
  }

  return (
    <header className="sticky top-0 z-50 bg-nav-bg">
      <Container size="wide">
        <div className="relative flex h-16 items-center justify-between">
          <Logo />
          <HeaderClient
            categories={categories}
            trendingPosts={trendingPosts}
          />
        </div>
      </Container>
    </header>
  )
}
