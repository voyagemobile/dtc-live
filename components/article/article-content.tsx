'use client'

import { useEffect, useRef } from 'react'

interface ArticleContentProps {
  html: string
}

export function ArticleContent({ html }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Handle broken images gracefully — Ghost bookmark cards contain
  // images hosted on Ghost's CDN which may 404 after domain cutover.
  // Hide broken images instead of showing the browser's broken icon.
  useEffect(() => {
    if (!ref.current) return

    const images = ref.current.querySelectorAll('img')
    images.forEach((img) => {
      if (img.complete && img.naturalWidth === 0) {
        // Already failed to load
        img.style.display = 'none'
      }
      img.addEventListener('error', () => {
        img.style.display = 'none'
      })
    })
  }, [html])

  return (
    <div
      ref={ref}
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
