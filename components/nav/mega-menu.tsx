'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NavLink } from '@/components/nav/nav-link'
import { Container } from '@/components/ui/container'
import type { GhostPost } from '@/lib/types'

/** Category definition with editorial description. */
export interface NavCategory {
  label: string
  slug: string
  href: string
  description: string
}

interface MegaMenuProps {
  categories: NavCategory[]
  trendingPosts: GhostPost[]
}

/** Delay in ms before closing the dropdown when the mouse leaves. */
const CLOSE_DELAY = 250

/**
 * NYT-style mega dropdown menu for desktop navigation.
 *
 * Hovering a category reveals a full-width panel with:
 * - Category name and editorial description
 * - 2-3 featured articles with thumbnails (filtered from trending by tag)
 * - A "Trending Now" sidebar with the most recent posts
 * - "View All" link to the category page
 *
 * Uses pure CSS transitions for smooth enter/exit animation.
 * Dynamically imported by Header via next/dynamic to stay out of the initial bundle.
 */
export default function MegaMenu({ categories, trendingPosts }: MegaMenuProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setActiveSlug(null)
    }, CLOSE_DELAY)
  }, [clearCloseTimer])

  const handleCategoryEnter = useCallback(
    (slug: string) => {
      clearCloseTimer()
      setActiveSlug(slug)
    },
    [clearCloseTimer]
  )

  const handlePanelEnter = useCallback(() => {
    clearCloseTimer()
  }, [clearCloseTimer])

  // Close on Escape key — only register the handler while a panel is open
  // to avoid interfering with other Escape consumers on the page.
  useEffect(() => {
    if (!activeSlug) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveSlug(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeSlug])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  /**
   * Pre-compute featured posts per category slug.
   * Avoids re-filtering on every render by memoizing the full lookup map.
   */
  const featuredBySlug = useMemo(() => {
    const map: Record<string, GhostPost[]> = {}
    for (const category of categories) {
      const matched = trendingPosts.filter((post) =>
        post.tags?.some((tag) => tag.slug === category.slug)
      )
      map[category.slug] =
        matched.length >= 2 ? matched.slice(0, 3) : trendingPosts.slice(0, 3)
    }
    return map
  }, [categories, trendingPosts])

  const activeCategory = categories.find((c) => c.slug === activeSlug)
  const isOpen = activeSlug !== null

  return (
    <nav className="hidden md:block" aria-label="Main navigation">
      <ul className="flex items-center gap-8" role="menubar">
        {categories.map((category) => {
          const isActive = activeSlug === category.slug
          return (
            <li
              key={category.slug}
              role="none"
              onMouseEnter={() => handleCategoryEnter(category.slug)}
              onMouseLeave={scheduleClose}
            >
              <Link
                href={category.href}
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={isActive}
                onFocus={() => handleCategoryEnter(category.slug)}
                onBlur={scheduleClose}
                className={`group relative block py-5 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-nav-text'
                    : 'text-nav-text/80 hover:text-nav-text'
                }`}
              >
                {category.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Mega dropdown panel */}
      <div
        className={`absolute inset-x-0 top-full z-50 border-t border-white/10 bg-nav-bg shadow-2xl transition-all duration-300 ease-out ${
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={scheduleClose}
        role="menu"
        aria-label={activeCategory ? `${activeCategory.label} submenu` : undefined}
      >
        <Container size="wide">
          <div className="grid grid-cols-12 gap-8 py-8">
            {/* Left column: Category info + featured articles */}
            <div className="col-span-8 border-r border-white/10 pr-8">
              {activeCategory && (
                <>
                  {/* Category header */}
                  <div className="mb-6">
                    <h3 className="font-heading text-xl font-bold text-nav-text">
                      {activeCategory.label}
                    </h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-nav-text/60">
                      {activeCategory.description}
                    </p>
                  </div>

                  {/* Featured articles grid */}
                  <div className="grid grid-cols-3 gap-5">
                    {(featuredBySlug[activeCategory.slug] ?? []).map((post) => (
                      <Link
                        key={post.id}
                        href={`/${post.slug}`}
                        className="group/card block"
                        role="menuitem"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-white/5">
                          {post.feature_image ? (
                            <Image
                              src={post.feature_image}
                              alt={post.feature_image_alt || post.title}
                              fill
                              sizes="(min-width: 768px) 280px, 200px"
                              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-nav-text/20">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="mt-2.5 font-heading text-sm font-semibold leading-snug text-nav-text/90 transition-colors duration-200 group-hover/card:text-primary">
                          {post.title}
                        </h4>
                        {post.reading_time > 0 && (
                          <p className="mt-1 text-xs text-nav-text/40">
                            {post.reading_time} min read
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* View All link */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <NavLink href={activeCategory.href} role="menuitem" className="text-xs uppercase tracking-widest">
                      View All {activeCategory.label}
                      <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </NavLink>
                  </div>
                </>
              )}
            </div>

            {/* Right column: Trending Now */}
            <div className="col-span-4 pl-2">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
                Trending Now
              </h3>
              <ol className="space-y-4">
                {trendingPosts.slice(0, 5).map((post, index) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.slug}`}
                      className="group/trend flex items-start gap-3"
                      role="menuitem"
                    >
                      <span className="mt-0.5 flex-none font-heading text-lg font-bold leading-none text-nav-text/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-body text-sm font-medium leading-snug text-nav-text/80 transition-colors duration-200 group-hover/trend:text-nav-text">
                          {post.title}
                        </h4>
                        {post.primary_tag && (
                          <p className="mt-0.5 text-xs text-nav-text/40">
                            {post.primary_tag.name}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>
    </nav>
  )
}
