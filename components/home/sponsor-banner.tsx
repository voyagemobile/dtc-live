import Link from 'next/link'

/**
 * LiveRecover sponsor banner: dark gradient background with brand logos,
 * tagline, and CTA. Placed strategically in the homepage feed.
 */
export function SponsorBanner() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-4">
        <Link
          href="https://liverecover.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block overflow-hidden rounded-lg"
        >
          {/* Background */}
          <div className="relative bg-gradient-to-r from-[#1a1035] via-[#1e1445] to-[#2a1855] px-6 py-5 sm:px-8 sm:py-6">
            {/* Subtle glow effect */}
            <div className="pointer-events-none absolute -right-20 top-0 h-full w-1/2 bg-gradient-to-l from-purple-500/10 to-transparent" />
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Left: Logo + tagline */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
                {/* LiveRecover Logo */}
                <svg
                  viewBox="0 0 180 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto shrink-0 sm:h-6"
                >
                  <text
                    x="0"
                    y="22"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontSize="22"
                    fontWeight="700"
                    fill="white"
                    letterSpacing="-0.5"
                  >
                    live
                    <tspan fill="#8B5CF6">recover</tspan>
                  </text>
                </svg>

                <p className="text-center text-sm font-medium text-white/90 sm:text-left sm:text-base">
                  The human layer your SMS strategy is missing.
                </p>
              </div>

              {/* Right: CTA */}
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#7C3AED] px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 group-hover:bg-[#6D28D9]">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
