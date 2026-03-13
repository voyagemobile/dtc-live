'use client'

import { useEffect, useRef, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const prevProgressRef = useRef(0)

  useEffect(() => {
    let rafId: number
    let pulseTimeoutId: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight
        const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
        setProgress(pct)

        // Trigger completion pulse when crossing 100% threshold
        if (pct >= 100 && prevProgressRef.current < 100) {
          setIsComplete(true)
          // Reset after animation completes so it can re-trigger if needed
          pulseTimeoutId = setTimeout(() => setIsComplete(false), 600)
        }
        prevProgressRef.current = pct
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
      clearTimeout(pulseTimeoutId)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes progress-complete-pulse {
          0%   { transform: scaleX(1) scaleY(1); opacity: 1; }
          40%  { transform: scaleX(1) scaleY(2.5); opacity: 0.7; }
          70%  { transform: scaleX(1) scaleY(1.5); opacity: 0.9; }
          100% { transform: scaleX(1) scaleY(1); opacity: 1; }
        }
        .progress-bar-complete {
          animation: progress-complete-pulse 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Article reading progress"
        className="fixed top-0 left-0 right-0 z-[60] h-1 overflow-visible"
      >
        <div
          className={`h-full origin-left bg-[var(--color-primary)] will-change-transform${isComplete ? ' progress-bar-complete' : ''}`}
          style={{
            transform: `scaleX(${progress / 100})`,
            transition: isComplete
              ? 'none'
              : 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: progress > 0 ? '0 0 6px 0 rgba(255, 15, 100, 0.5)' : 'none',
          }}
        />
      </div>
    </>
  )
}
