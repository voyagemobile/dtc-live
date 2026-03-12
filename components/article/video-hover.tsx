'use client'

import { useRef, useState, useCallback } from 'react'

interface VideoHoverProps {
  videoUrl: string
  children: React.ReactNode
  className?: string
}

/**
 * Client wrapper that overlays a looping video on hover.
 * The static image (children) is always rendered; the video sits on top and
 * only plays while the pointer is inside the container.
 */
export function VideoHover({ videoUrl, children, className = '' }: VideoHoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleMouseEnter = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {
      // Autoplay may be blocked; silently degrade to static image.
    })
    setIsPlaying(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    setIsPlaying(false)
  }, [])

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
