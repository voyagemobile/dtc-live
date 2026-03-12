'use client'

import { useState, useCallback, useEffect } from 'react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    setHasNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    )
  }, [])

  const getUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/${slug}`
  }, [slug])

  const handleCopyLink = useCallback(async () => {
    const url = getUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [getUrl])

  const handleShareX = useCallback(() => {
    const url = getUrl()
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=550,height=420')
  }, [getUrl, title])

  const handleShareLinkedIn = useCallback(() => {
    const url = getUrl()
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=550,height=420')
  }, [getUrl])

  const handleNativeShare = useCallback(async () => {
    const url = getUrl()
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled or share failed silently
      }
    }
  }, [getUrl, title])

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
      <span className="text-sm font-medium text-text-muted">Share</span>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-150 hover:border-primary hover:text-primary"
        aria-label="Copy link to clipboard"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? 'Copied!' : 'Copy link'}
      </button>

      {/* X / Twitter */}
      <button
        type="button"
        onClick={handleShareX}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-150 hover:border-primary hover:text-primary"
        aria-label="Share on X"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={handleShareLinkedIn}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-150 hover:border-primary hover:text-primary"
        aria-label="Share on LinkedIn"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </button>

      {/* Native Share (mobile) */}
      {hasNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-150 hover:border-primary hover:text-primary"
          aria-label="Share via device share menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          More
        </button>
      )}
    </div>
  )
}
