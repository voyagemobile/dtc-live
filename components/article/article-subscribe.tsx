'use client'

import { useState, useCallback } from 'react'

/**
 * Inline subscribe form shown at the bottom of each article.
 * Simple pill-shaped input + button matching the site's CTA style.
 */
export function ArticleSubscribe() {
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
    <div className="mt-12 border-t border-border pt-8">
      {status === 'success' ? (
        <p className="text-center text-lg font-medium text-primary">
          You&rsquo;re in. Check your inbox.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md gap-0 overflow-hidden rounded-full border border-border bg-white shadow-sm"
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
            className="m-1 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
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
  )
}
