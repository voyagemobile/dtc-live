'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'

/**
 * Newsletter CTA using the official DTC Live banner design.
 * The banner image is shown as a visual, with a functional email form overlaid.
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
        {/* Desktop: full-width banner with overlaid form */}
        <div className="relative hidden overflow-hidden rounded-lg sm:block">
          <Image
            src="/cta-banner.png"
            alt="Subscribe to DTC Live"
            width={1280}
            height={200}
            className="w-full object-cover"
            priority
          />
          {/* Overlay the form on top of the banner */}
          <div className="absolute inset-0 flex items-center">
            <div className="ml-8 max-w-xl lg:ml-12">
              {status === 'success' ? (
                <p className="text-lg font-medium text-primary">
                  You&rsquo;re in. Check your inbox.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-20 flex max-w-md gap-0 overflow-hidden rounded-full border border-border/50 bg-white/90 shadow-sm backdrop-blur-sm"
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
                <p className="mt-2 text-sm text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: sidebar version */}
        <div className="sm:hidden">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/cta-sidebar.png"
              alt="Subscribe to DTC Live"
              width={400}
              height={500}
              className="w-full object-cover"
            />
          </div>
          {status === 'success' ? (
            <p className="mt-4 text-center text-lg font-medium text-primary">
              You&rsquo;re in. Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex gap-0 overflow-hidden rounded-full border border-border bg-white shadow-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 border-none bg-transparent px-5 py-3 text-sm text-text-body placeholder:text-text-caption focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="m-1 shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
