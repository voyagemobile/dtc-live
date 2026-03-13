'use client'

import { useState, useCallback } from 'react'

/**
 * Newsletter CTA using the official DTC Live banner design.
 * Banner shown as a crisp visual, functional email form below.
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
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        {/* Desktop banner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cta-banner.png"
          alt="Subscribe to DTC Live"
          className="hidden w-full rounded-lg sm:block"
        />

        {/* Mobile banner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cta-sidebar.png"
          alt="Subscribe to DTC Live"
          className="w-full rounded-lg sm:hidden"
        />

        {/* Email form below the banner */}
        <div className="mx-auto mt-5 max-w-lg">
          {status === 'success' ? (
            <p className="text-center text-lg font-medium text-primary">
              You&rsquo;re in. Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-0 overflow-hidden rounded-full border border-border bg-white shadow-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jamie@example.com"
                required
                className="flex-1 border-none bg-transparent px-5 py-3 text-sm text-text-body placeholder:text-text-caption focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="m-1 shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-2 text-center text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
