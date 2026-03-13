import Link from 'next/link'

/**
 * LiveRecover sponsor banner using the official design asset.
 * Thin, full-width clickable banner linking to liverecover.com.
 */
export function SponsorBanner() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-4">
        <Link
          href="https://liverecover.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block overflow-hidden rounded-lg transition-shadow duration-200 hover:shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lr-banner.png"
            alt="LiveRecover — Get Started"
            className="h-auto max-h-28 w-full rounded-lg object-cover object-left sm:max-h-32"
          />
        </Link>
      </div>
    </section>
  )
}
