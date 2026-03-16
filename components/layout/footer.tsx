'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { CopyrightYear } from '@/components/layout/copyright-year'

export function Footer() {
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
    <footer className="bg-nav-bg py-16 text-nav-text">
      <div className="mx-auto max-w-[1280px] px-5">
        <div className="flex flex-col items-center">
          {/* Favicon circle */}
          <div className="mb-8">
            <svg width="72" height="72" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="64" cy="64" r="64" fill="#F2245B"/>
              <path d="M28.448 84.228C25.872 84.228 23.6133 83.6493 21.672 82.492C19.768 81.3347 18.2933 79.636 17.248 77.396C16.2027 75.1187 15.68 72.3 15.68 68.94V67.82C15.68 64.6093 16.184 61.9213 17.192 59.756C18.2 57.5533 19.656 55.892 21.56 54.772C23.464 53.652 25.76 53.092 28.448 53.092C30.128 53.092 31.7147 53.484 33.208 54.268C34.7387 55.0147 36.008 56.116 37.016 57.572V44.3H45.64V83.5H37.688V79.468C36.9413 80.6627 35.7653 81.764 34.16 82.772C32.592 83.7427 30.688 84.228 28.448 84.228ZM30.52 77.116C31.752 77.116 32.8533 76.836 33.824 76.276C34.7947 75.6787 35.56 74.8387 36.12 73.756C36.7173 72.636 37.016 71.3107 37.016 69.78V66.98C37.016 65.4867 36.7173 64.236 36.12 63.228C35.56 62.22 34.7947 61.4733 33.824 60.988C32.8533 60.4653 31.752 60.204 30.52 60.204C28.7653 60.204 27.328 60.8387 26.208 62.108C25.088 63.34 24.528 65.244 24.528 67.82V68.94C24.528 71.628 25.088 73.6627 26.208 75.044C27.3653 76.4253 28.8027 77.116 30.52 77.116ZM61.6131 83.836C59.1491 83.836 57.1331 83.5187 55.5651 82.884C53.9971 82.212 52.8398 81.1293 52.0931 79.636C51.3465 78.1053 50.9731 76.0333 50.9731 73.42V60.876H47.3331V53.82H50.9731V47.1H59.5971V53.82H66.3731V60.876H59.5971V72.02C59.5971 73.7 59.8585 74.8947 60.3811 75.604C60.9411 76.3133 62.0051 76.668 63.5731 76.668C64.6931 76.668 65.8131 76.612 66.9331 76.5V83.5C66.2238 83.612 65.4771 83.6867 64.6931 83.724C63.9091 83.7987 62.8825 83.836 61.6131 83.836ZM83.195 84.228C80.283 84.228 77.6883 83.668 75.411 82.548C73.1337 81.428 71.3417 79.7293 70.035 77.452C68.7283 75.1747 68.075 72.3373 68.075 68.94V67.82C68.075 64.684 68.747 62.0147 70.091 59.812C71.4723 57.6093 73.3017 55.948 75.579 54.828C77.8937 53.6707 80.4323 53.092 83.195 53.092C86.1817 53.092 88.683 53.6147 90.699 54.66C92.715 55.668 94.2643 57.0307 95.347 58.748C96.4297 60.4653 97.0457 62.3693 97.195 64.46H88.291C88.0297 63.116 87.4883 62.0893 86.667 61.38C85.883 60.6333 84.7257 60.26 83.195 60.26C82.0003 60.26 80.9177 60.54 79.947 61.1C79.0137 61.66 78.267 62.5 77.707 63.62C77.1843 64.7027 76.923 66.1027 76.923 67.82V68.94C76.923 70.7693 77.1843 72.2813 77.707 73.476C78.2297 74.6707 78.9577 75.5667 79.891 76.164C80.8243 76.724 81.9257 77.004 83.195 77.004C84.5017 77.004 85.603 76.668 86.499 75.996C87.4323 75.2867 88.0297 74.2413 88.291 72.86H97.195C97.0457 75.1747 96.3737 77.1907 95.179 78.908C93.9843 80.6253 92.3603 81.9507 90.307 82.884C88.291 83.78 85.9203 84.228 83.195 84.228ZM104.396 84.228C103.426 84.228 102.53 83.9853 101.708 83.5C100.887 83.052 100.234 82.436 99.7482 81.652C99.3002 80.8307 99.0762 79.8973 99.0762 78.852C99.0762 77.396 99.5802 76.164 100.588 75.156C101.634 74.1107 102.903 73.588 104.396 73.588C105.89 73.588 107.159 74.1107 108.204 75.156C109.25 76.164 109.772 77.396 109.772 78.852C109.772 79.8973 109.53 80.8307 109.044 81.652C108.559 82.436 107.906 83.052 107.084 83.5C106.3 83.9853 105.404 84.228 104.396 84.228Z" fill="white"/>
            </svg>
          </div>

          {/* Navigation */}
          <nav className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
            <Link href="/" className="py-2 text-nav-text/70 transition-colors duration-200 hover:text-primary">
              Home
            </Link>
            <Link href="/category/industry" className="py-2 text-nav-text/70 transition-colors duration-200 hover:text-primary">
              Industry
            </Link>
            <Link href="/category/strategies" className="py-2 text-nav-text/70 transition-colors duration-200 hover:text-primary">
              Strategies
            </Link>
            <Link href="/category/analysis" className="py-2 text-nav-text/70 transition-colors duration-200 hover:text-primary">
              Analysis
            </Link>
            <Link href="/fastest-growing-dtc-brands-in-2025" className="py-2 text-nav-text/70 transition-colors duration-200 hover:text-primary">
              Top DTC Brands
            </Link>
          </nav>

          {/* Social icons */}
          <div className="mb-8 flex gap-3">
            <a
              href="https://x.com/dtcliveUS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-nav-text/20 text-nav-text/70 transition-colors duration-200 hover:border-primary hover:text-primary"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/dtclive-us"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-nav-text/20 text-nav-text/70 transition-colors duration-200 hover:border-primary hover:text-primary"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Newsletter subscribe */}
          <div className="mb-10 w-full max-w-md">
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-400">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex gap-0">
                  <label htmlFor="footer-email" className="sr-only">Email</label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === 'error') setStatus('idle')
                    }}
                    placeholder="Enter your email"
                    required
                    className="h-11 min-w-0 flex-1 rounded-l-full border border-nav-text/20 bg-transparent px-5 text-sm text-nav-text outline-none placeholder:text-nav-text/40 focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="h-11 shrink-0 rounded-r-full bg-primary px-6 text-sm font-bold text-white transition-colors duration-150 hover:bg-primary-hover disabled:opacity-60"
                  >
                    {status === 'loading' ? '...' : 'Subscribe'}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="mt-2 text-center text-xs text-red-400">{message}</p>
                )}
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center gap-3 border-t border-nav-text/10 pt-6">
            <div className="flex gap-6 text-xs text-nav-text/40">
              <Link href="/terms" className="py-1.5 transition-colors duration-200 hover:text-nav-text/70">
                Terms of Service
              </Link>
              <Link href="/privacy" className="py-1.5 transition-colors duration-200 hover:text-nav-text/70">
                Privacy Policy
              </Link>
              <a href="mailto:contact@dtc.live" className="py-1.5 transition-colors duration-200 hover:text-nav-text/70">
                Contact
              </a>
            </div>
            <p className="text-xs text-nav-text/40">
              &copy; <CopyrightYear /> DTC Live. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
