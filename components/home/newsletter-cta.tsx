'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

/**
 * Newsletter CTA using the designed banner image (cta-banner.png) as background.
 * The image has the headline, subheading, and decorative pink circles but NO form.
 * A real email input + subscribe button is positioned in the empty space below the text.
 *
 * On mobile, falls back to a text-based layout since the image is too wide.
 */
export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email.trim()) return

      setStatus('loading')
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        const data = await res.json()
        if (data.success) {
          setStatus('success')
          setMessage("You're in! Check your inbox.")
          setEmail('')
        } else {
          setStatus('error')
          setMessage(data.error || 'Something went wrong.')
        }
      } catch {
        setStatus('error')
        setMessage('Something went wrong. Try again.')
      }
    },
    [email]
  )

  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        {/* Desktop: image background with overlaid form */}
        <div className="hidden sm:block">
          <div
            className="relative overflow-hidden rounded-xl"
            style={{ aspectRatio: '1320 / 325' }}
          >
            <Image
              src="/cta-banner.png"
              alt="The Smartest Brands Subscribe to DTC.Live"
              width={2640}
              height={650}
              className="absolute inset-0 h-full w-full object-cover"
              priority={false}
            />

            {/* Form overlay — aligned with heading text in the image */}
            <div
              className="absolute z-10"
              style={{ left: '4.8%', bottom: '22%', width: '42%' }}
            >
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {message}
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="flex gap-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === 'error') setStatus('idle')
                      }}
                      placeholder="jamie@example.com"
                      required
                      className="h-10 flex-1 rounded-l-full border-0 bg-white px-5 text-sm text-text-body outline-none placeholder:text-text-caption/50 focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="h-10 shrink-0 rounded-r-full bg-primary px-6 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
                    >
                      {status === 'loading' ? '...' : 'Subscribe'}
                    </button>
                  </form>
                  {status === 'error' && (
                    <p className="mt-1.5 text-xs text-red-500">{message}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: stacked text layout */}
        <div className="sm:hidden">
          <div className="overflow-hidden rounded-xl bg-[#f5f3f0] px-6 py-8">
            <h2 className="font-heading text-2xl font-bold leading-tight text-text-headline">
              The Smartest Brands Subscribe to DTC.Live
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              The intelligence every DTC operator needs to build, grow, and scale.
            </p>

            {status === 'success' ? (
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="jamie@example.com"
                  required
                  className="h-12 rounded-full border-0 bg-white px-5 text-sm text-text-body shadow-sm outline-none placeholder:text-text-caption/60 focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-12 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-2 text-xs text-red-500">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
