'use client'

import { useRef, useEffect } from 'react'

interface AutoPlayVideoProps {
  src: string
  poster?: string
  className?: string
}

/**
 * Video element that aggressively ensures autoplay works.
 * Browsers often silently ignore the `autoPlay` HTML attribute,
 * so we explicitly call .play() on mount and on canplay events.
 */
export function AutoPlayVideo({ src, poster, className }: AutoPlayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const tryPlay = () => {
      video.play().catch(() => {
        // Silently ignore — browser policy blocked autoplay
      })
    }

    // Try immediately
    tryPlay()

    // Retry when video has enough data to play
    video.addEventListener('canplay', tryPlay)

    return () => {
      video.removeEventListener('canplay', tryPlay)
    }
  }, [src])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    />
  )
}
