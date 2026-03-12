import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'
import { CopyrightYear } from '@/components/layout/copyright-year'

const sectionLinks = [
  { label: 'Industry', href: '/category/industry' },
  { label: 'Strategies', href: '/category/strategies' },
  { label: 'Analysis', href: '/category/analysis' },
  { label: 'Top DTC Brands', href: '/category/top-dtc-brands' },
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
