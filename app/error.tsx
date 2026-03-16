'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center sm:py-32">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Error</p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-text-headline sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
        We hit an unexpected error loading this page. Try refreshing, or head back to
        the homepage.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-bold text-text-headline transition-colors hover:border-primary hover:text-primary"
        >
          Try again
        </button>
        {/* Plain <a> for hard navigation after error state */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
