import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist or has been moved.",
}

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center sm:py-32">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-text-headline sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to
        the homepage for the latest DTC insights.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
      >
        Back to Home
      </Link>
    </div>
  )
}
