import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'
import { CopyrightYear } from '@/components/layout/copyright-year'

const sectionLinks = [
  { label: 'Industry', href: '/category/industry' },
  { label: 'Strategies', href: '/category/strategies' },
  { label: 'Analysis', href: '/category/analysis' },
  { label: 'Top DTC Brands', href: '/fastest-growing-dtc-brands-in-2025' },
]

export function Footer() {
  return (
    <footer className="bg-nav-bg py-12 text-nav-text">
      <Container size="wide">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding column */}
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-nav-text/60">
              The DTC industry&apos;s leading media brand.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/dtcliveUS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="text-nav-text/70 transition-colors duration-200 hover:text-primary"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/dtclive-us"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="text-nav-text/70 transition-colors duration-200 hover:text-primary"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Sections column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-nav-text/40">
              Sections
            </h3>
            <ul className="space-y-2">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-nav-text/70 transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-nav-text/40">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-nav-text/70 transition-colors duration-200 hover:text-primary"
                >
                  About DTC Live
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-nav-text/70 transition-colors duration-200 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-nav-text/10 pt-6">
          <p className="text-center text-xs text-nav-text/40">
            &copy; <CopyrightYear /> DTC Live. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
