'use client'

import dynamic from 'next/dynamic'

/**
 * Deferred analytics loader.
 *
 * Wraps @vercel/analytics in a Client Component so that next/dynamic
 * with `ssr: false` can be used (Server Components do not allow ssr:false).
 * This satisfies the bundle-defer-third-party rule: the analytics script
 * is loaded only after client-side hydration, not in the initial bundle.
 */
const Analytics = dynamic(
  () => import('@vercel/analytics/next').then((m) => m.Analytics),
  { ssr: false }
)

export function AnalyticsProvider() {
  return <Analytics />
}
