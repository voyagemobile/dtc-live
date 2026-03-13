'use client'

import { useState, useCallback } from 'react'

/**
 * Newsletter CTA matching the DTC Live brand: light background,
 * bold headline, decorative pink gradient circles on the right.
 */
export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email.trim()) return

      setStatus('loading')
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (res.ok) {
          setStatus('success')
          setEmail('')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    },
    [email]
  )

  return (
    <section className="relative overflow-hidden border-y border-border bg-[#f9f5f6]">
      {/* Decorative pink gradient circles */}
      <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative h-[320px] w-[320px]">
          <div className="absolute right-0 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/10 to-primary/5" />
          <div className="absolute right-8 top-1/2 h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/15 to-primary/8" />
          <div className="absolute right-16 top-1/2 h-[160px] w-[160px] -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/25 to-primary/12" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-5 py-12 lg:py-16">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold text-text-headline sm:text-3xl lg:text-4xl">
            The Smartest Brands Subscribe to DTC.Live &ndash; Do You?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted lg:text-lg">
            The intelligence every DTC operator needs to build, grow, and scale.
          </p>

          {status === 'success' ? (
            <p className="mt-6 text-lg font-medium text-primary">
              You&rsquo;re in. Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex max-w-lg gap-0 overflow-hidden rounded-full border border-border bg-white shadow-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jamie@example.com"
                required
                className="flex-1 border-none bg-transparent px-5 py-3.5 text-sm text-text-body placeholder:text-text-caption focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="m-1.5 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
