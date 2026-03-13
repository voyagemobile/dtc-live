'use client'

import { useState, useCallback } from 'react'

/**
 * Bold newsletter subscription CTA with email input.
 * Full-width dark band that breaks up the page and drives subscriptions.
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
    <section className="bg-foreground">
      <div className="mx-auto max-w-[1280px] px-5 py-16 text-center lg:py-20">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Stay ahead of the curve.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
          Weekly insights on DTC strategy, growth tactics, and the trends shaping e-commerce. Join 10,000+ operators.
        </p>

        {status === 'success' ? (
          <p className="mt-8 text-lg font-medium text-primary">
            You&rsquo;re in. Check your inbox.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  )
}
