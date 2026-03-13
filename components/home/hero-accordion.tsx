'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { extractVideo } from '@/lib/video'
import { WordPullUp } from '@/components/ui/word-pull-up'
import { AutoPlayVideo } from '@/components/ui/autoplay-video'

interface HeroAccordionProps {
  posts: GhostPost[]
}

interface CategoryPanel {
  name: string
  slug: string
  image: string
  imageAlt: string
  videoSrc: string | null
  videoThumbnail: string | null
}

function deriveCategoryPanels(posts: GhostPost[]): CategoryPanel[] {
  const seen = new Set<string>()
  const panels: CategoryPanel[] = []

  for (const post of posts) {
    if (!post.primary_tag || !post.feature_image) continue
    const tagSlug = post.primary_tag.slug
    if (seen.has(tagSlug)) continue
    seen.add(tagSlug)

    const video = extractVideo(post.html)

    panels.push({
      name: post.primary_tag.name,
      slug: tagSlug,
      image: post.feature_image,
      imageAlt: post.feature_image_alt || post.primary_tag.name,
      videoSrc: video?.src || null,
      videoThumbnail: video?.thumbnail || null,
    })
    if (panels.length >= 3) break
  }

  return panels
}

/* ── Animated background paths (pink on white) ── */
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#F2245B"
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.025}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function AccordionItem({
  panel,
  isActive,
  isResting,
  onMouseEnter,
  onMouseLeave,
}: {
  panel: CategoryPanel
  isActive: boolean
  isResting: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  // All states use flex basis for smooth transitions
  const flexVal = isActive ? 'flex-[8_1_0%]' : isResting ? 'flex-[1_1_0%]' : 'flex-[0.5_1_0%]'

  return (
    <Link
      href={`/category/${panel.slug}`}
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer block h-full
        transition-[flex] duration-700 ease-in-out
        ${flexVal}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Video or image — plain native <video> for reliable autoplay (no React wrapper) */}
      {panel.videoSrc ? (
        <video
          src={panel.videoSrc}
          poster={panel.videoThumbnail || panel.image}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`
            absolute inset-0 h-full w-full object-cover
            transition-transform duration-[8s] ease-out
            ${isActive ? 'scale-110' : 'scale-100'}
          `}
        />
      ) : (
        <Image
          src={panel.image}
          alt={panel.imageAlt}
          fill
          sizes="(max-width: 768px) 280px, 600px"
          priority
          className={`
            object-cover transition-transform duration-[8s] ease-out
            ${isActive ? 'scale-110' : 'scale-100'}
          `}
        />
      )}

      {/* Active: heavy bottom gradient */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.1) 50%, transparent 65%)',
        }}
      />

      {/* Collapsed: solid dark overlay */}
      <div
        className={`
          absolute inset-0 bg-black/65 transition-opacity duration-500
          ${isActive ? 'opacity-0' : isResting ? 'opacity-50' : 'opacity-100'}
        `}
      />

      {/* Category name — always bottom-left, scales with panel size */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 transition-all duration-500">
        <h3
          className={`
            font-bold leading-tight font-heading uppercase tracking-wide
            transition-all duration-500
            ${isActive ? 'text-2xl md:text-3xl tracking-normal' : 'text-xs tracking-[0.15em]'}
          `}
          style={{
            color: '#ffffff',
            textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          {panel.name}
        </h3>
      </div>
    </Link>
  )
}

export function HeroAccordion({ posts }: HeroAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const panels = deriveCategoryPanels(posts)

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated pink path background */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-10">
          {/* Left: Editorial text — narrower to close the gap */}
          <div className="w-full lg:w-4/12 text-center lg:text-left shrink-0">
            <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-bold text-text-headline leading-[1.1] tracking-tight font-heading">
              The Playbook for Building Brands That Last
            </h1>
            <WordPullUp
              words="Real tactics, sharp analysis, and the stories behind the DTC brands actually winning right now."
              className="mt-6 text-lg text-text-body max-w-xl mx-auto lg:mx-0 font-body leading-relaxed text-left font-normal tracking-normal drop-shadow-none"
            />
          </div>

          {/* Right: Image accordion — wider to fill space */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Desktop accordion */}
            <div className="hidden md:flex items-stretch gap-3 h-[480px]">
              {panels.map((panel, index) => (
                <AccordionItem
                  key={panel.slug}
                  panel={panel}
                  isActive={index === activeIndex}
                  isResting={activeIndex === null}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              ))}
            </div>

            {/* Mobile: horizontal scroll cards — NO eager video loading to avoid
                duplicating the desktop video downloads on initial page load */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5">
              {panels.map((panel) => (
                <Link
                  key={panel.slug}
                  href={`/category/${panel.slug}`}
                  className="relative shrink-0 w-[280px] h-[360px] rounded-2xl overflow-hidden snap-start block"
                >
                  {panel.videoSrc ? (
                    <AutoPlayVideo
                      src={panel.videoSrc}
                      poster={panel.videoThumbnail || panel.image}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={panel.image}
                      alt={panel.imageAlt}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3
                      className="text-xl font-bold leading-snug font-heading"
                      style={{ color: '#ffffff' }}
                    >
                      {panel.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
