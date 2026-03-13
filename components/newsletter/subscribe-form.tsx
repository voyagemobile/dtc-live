'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface SubscribeFormProps {
  variant?: 'default' | 'inline'
}

export function SubscribeForm({ variant = 'default' }: SubscribeFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  // Stable IDs for input↔error association across SSR + client hydration
  const inputId = useId()
  const errorId = useId()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = (await res.json()) as { success: boolean; error?: string }

      if (data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (variant === 'inline') {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-5">
        {status === 'success' ? (
          // role="status" is a polite live region — announces without interrupting
          <p role="status" className="text-sm font-medium text-text-body">
            You&apos;re in! Check your inbox for a welcome email.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-text-headline">
              Get DTC insights in your inbox
            </p>
            <form onSubmit={handleSubmit} noValidate>
              {/* flex-wrap prevents the button being squeezed at very narrow widths */}
              <div className="flex flex-wrap gap-2">
                <input
                  id={inputId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  aria-describedby={status === 'error' ? errorId : undefined}
                  aria-invalid={status === 'error' ? true : undefined}
                  required
                  disabled={status === 'loading'}
                  className="min-w-0 flex-1 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-text-body placeholder:text-text-muted focus:outline-2 focus:outline-primary disabled:opacity-50"
                />
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {status === 'error' && (
                <p id={errorId} className="mt-2 text-xs text-red-600" role="alert" aria-atomic="true">
                  {errorMessage}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="rounded-xl border border-border bg-surface px-8 py-10 text-center">
      {status === 'success' ? (
        // role="status" is a polite live region — announces without interrupting
        <p role="status" className="text-base font-medium text-text-body">
          You&apos;re in! Check your inbox for a welcome email.
        </p>
      ) : (
        <>
          <h2 className="mb-2 font-heading text-2xl font-bold text-text-headline">
            Stay in the Loop
          </h2>
          <p className="mb-6 text-sm text-text-muted">
            Get the latest DTC insights delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-sm">
            <div className="flex flex-col gap-3">
              <input
                id={inputId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                aria-describedby={status === 'error' ? errorId : undefined}
                aria-invalid={status === 'error' ? true : undefined}
                required
                disabled={status === 'loading'}
                className="w-full rounded-md border border-border bg-surface-elevated px-4 py-2.5 text-sm text-text-body placeholder:text-text-muted focus:outline-2 focus:outline-primary disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="default"
                size="default"
                disabled={status === 'loading'}
                className="w-full"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            {status === 'error' && (
              <p id={errorId} className="mt-3 text-sm text-red-600" role="alert" aria-atomic="true">
                {errorMessage}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}
