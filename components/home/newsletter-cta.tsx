'use client'

import { useState, useCallback } from 'react'

/**
 * Newsletter CTA with real functional subscribe form.
 * Design: light gray banner, bold headline, email input + pink button,
 * decorative pink concentric circles on the right.
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
        <div className="relative overflow-hidden rounded-xl bg-[#f5f3f0]">
          {/* Decorative circles — right side */}
          <div className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 sm:block">
            <div className="relative h-[320px] w-[320px]">
              <div className="absolute inset-0 rounded-full bg-[#F2245B]/[0.07]" />
              <div className="absolute inset-6 rounded-full bg-[#F2245B]/[0.10]" />
              <div className="absolute inset-12 rounded-full bg-[#F2245B]/[0.15]" />
              <div className="absolute inset-[72px] rounded-full bg-[#F2245B]/[0.20]" />
            </div>
          </div>

          <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-12 lg:max-w-[65%]">
            <h2 className="font-heading text-2xl font-bold leading-tight text-text-headline sm:text-3xl lg:text-[2rem]">
              The Smartest Brands Subscribe to DTC.Live
            </h2>
            <p className="mt-2.5 text-base leading-relaxed text-text-muted sm:text-lg">
              The intelligence every DTC operator needs to build, grow, and scale.
            </p>

            {status === 'success' ? (
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-green-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="jamie@example.com"
                  required
                  className="h-12 flex-1 rounded-full border-0 bg-white px-5 text-sm text-text-body shadow-sm outline-none placeholder:text-text-caption/60 focus:ring-2 focus:ring-primary/30 sm:rounded-r-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-12 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60 sm:rounded-l-none"
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
