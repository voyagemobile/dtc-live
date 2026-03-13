import Link from 'next/link'
import Image from 'next/image'

/**
 * LiveRecover sponsor banner using the official 2x design asset.
 * The image is rendered at half its native pixel dimensions for
 * crisp display on retina screens.
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
          <Image
            src="/lr-banner.png"
            alt="LiveRecover — The human layer your SMS strategy is missing. Get Started."
            width={1456}
            height={180}
            className="h-auto w-full rounded-lg"
            priority={false}
          />
        </Link>
      </div>
    </section>
  )
}
