'use client'

import { useRef, useEffect, useState } from 'react'

interface AutoPlayVideoProps {
  src: string
  poster?: string
  className?: string
  /** Load and play immediately (for above-the-fold content like hero accordion) */
  eager?: boolean
}

/**
 * Video element that only loads and plays when visible in the viewport.
 *
 * Without this, every article card with a video would start buffering an mp4
 * on page load (26+ videos), crushing bandwidth and causing long stalls.
 *
 * - eager=true: load immediately (hero accordion, above the fold)
 * - eager=false (default): wait until scrolled into view via IntersectionObserver
 */
export function AutoPlayVideo({ src, poster, className, eager = false }: AutoPlayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(eager)

  // IntersectionObserver: only load video when it enters viewport
  useEffect(() => {
    if (eager) return
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' } // Start loading just before it scrolls into view
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [eager])

  // Explicitly call .play() — browsers often ignore the autoPlay attribute
  useEffect(() => {
    if (!isVisible) return
    const video = ref.current
    if (!video) return

    const tryPlay = () => {
      video.play().catch(() => {
        // Silently ignore — browser policy blocked autoplay
      })
    }

    // Try immediately
    tryPlay()

    // Retry when video has enough data
    video.addEventListener('canplay', tryPlay)
    return () => video.removeEventListener('canplay', tryPlay)
  }, [isVisible, src])

  return (
    <video
      ref={ref}
      src={isVisible ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'none'}
      className={className}
    />
  )
}
