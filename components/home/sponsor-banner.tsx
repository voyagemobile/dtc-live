import Link from 'next/link'

/**
 * LiveRecover sponsor banner using the official design asset.
 * Image is 728x90 — displayed at natural aspect ratio, centered,
 * not stretched beyond its native resolution.
 */
export function SponsorBanner() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-6">
        <Link
          href="https://liverecover.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mx-auto block max-w-3xl transition-opacity duration-200 hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lr-banner.png"
            alt="LiveRecover — The human layer your SMS strategy is missing. Get Started."
            className="h-auto w-full rounded-lg"
          />
        </Link>
      </div>
    </section>
  )
}
