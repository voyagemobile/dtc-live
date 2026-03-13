import Image from 'next/image'
import Link from 'next/link'

/**
 * LiveRecover sponsor banner using the official design asset.
 * Full-width clickable banner linking to liverecover.com.
 */
export function SponsorBanner() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        <Link
          href="https://liverecover.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block overflow-hidden rounded-lg transition-shadow duration-200 hover:shadow-lg"
        >
          <Image
            src="/lr-banner.png"
            alt="LiveRecover — Get Started"
            width={1280}
            height={200}
            className="w-full object-cover"
          />
        </Link>
      </div>
    </section>
  )
}
