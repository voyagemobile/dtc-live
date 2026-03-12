'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GhostPost } from '@/lib/types'
import type { NavCategory } from '@/components/nav/mega-menu'

interface MobileMenuProps {
  categories: NavCategory[]
  trendingPosts: GhostPost[]
  isOpen: boolean
  onClose: () => void
}

/**
 * Full-screen mobile navigation overlay.
 *
 * Slides in from the right with a smooth CSS transform transition.
 * Categories are listed vertically, each expandable to reveal 2-3
 * article previews underneath. Includes a focus trap and Escape-to-close
 * for full keyboard accessibility.
 *
 * Dynamically imported by Header via next/dynamic.
 */
export default function MobileMenu({
  categories,
  trendingPosts,
  isOpen,
  onClose,
}: MobileMenuProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const toggleCategory = useCallback((slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }, [])

  /** Get articles for an expanded category. */
  function getPostsForCategory(slug: string): GhostPost[] {
    const matched = trendingPosts.filter((post) =>
      post.tags?.some((tag) => tag.slug === slug)
    )
    if (matched.length >= 2) return matched.slice(0, 3)
    return trendingPosts.slice(0, 3)
  }

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when open; reset expanded category on close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the close button when opening
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus()
      })
    } else {
      document.body.style.overflow = ''
      // Collapse any expanded category so the menu is fresh on reopen
      setExpandedSlug(null)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap: keep Tab cycling within the overlay
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !menuRef.current) return

      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        ref={menuRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-nav-bg transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <span className="font-heading text-lg font-bold text-nav-text">
            Menu
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-nav-text/80 transition-colors duration-200 hover:text-nav-text"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Categories */}
          <nav aria-label="Mobile navigation" className="px-6 py-4">
            <ul className="space-y-1">
              {categories.map((category) => {
                const isExpanded = expandedSlug === category.slug
                const categoryPosts = getPostsForCategory(category.slug)
                return (
                  <li key={category.slug}>
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.slug)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between py-3 text-left"
                    >
                      <span className="font-heading text-lg font-semibold text-nav-text">
                        {category.label}
                      </span>
                      <svg
                        className={`h-5 w-5 flex-none text-nav-text/40 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>

                    {/* Expandable article previews */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="mb-3 font-body text-xs leading-relaxed text-nav-text/50">
                        {category.description}
                      </p>
                      <div className="space-y-3 pb-3">
                        {categoryPosts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/${post.slug}`}
                            onClick={onClose}
                            className="group/mobile flex items-start gap-3"
                          >
                            {post.feature_image && (
                              <div className="relative h-14 w-14 flex-none overflow-hidden rounded-sm bg-white/5">
                                <Image
                                  src={post.feature_image}
                                  alt={post.feature_image_alt || post.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 pt-0.5">
                              <h4 className="font-body text-sm font-medium leading-snug text-nav-text/70 transition-colors duration-200 group-hover/mobile:text-nav-text">
                                {post.title}
                              </h4>
                              {post.reading_time > 0 && (
                                <p className="mt-0.5 text-xs text-nav-text/30">
                                  {post.reading_time} min read
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* View All link */}
                      <Link
                        href={category.href}
                        onClick={onClose}
                        className="group/view mb-2 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary transition-colors duration-200 hover:text-primary/80"
                      >
                        View All {category.label}
                        <span className="ml-1.5 inline-block transition-transform duration-200 group-hover/view:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </div>

                    {/* Divider between categories */}
                    <div className="border-b border-white/5" />
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Trending section */}
          {trendingPosts.length > 0 && (
            <div className="border-t border-white/10 px-6 py-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Trending Now
              </h3>
              <ol className="space-y-3">
                {trendingPosts.slice(0, 3).map((post, index) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.slug}`}
                      onClick={onClose}
                      className="group/trend flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-none font-heading text-base font-bold leading-none text-nav-text/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-body text-sm font-medium leading-snug text-nav-text/70 transition-colors duration-200 group-hover/trend:text-nav-text">
                        {post.title}
                      </h4>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
