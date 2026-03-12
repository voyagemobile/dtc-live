import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'

const navLinks = [
  { label: 'Industry', href: '/category/industry' },
  { label: 'Strategies', href: '/category/strategies' },
  { label: 'Analysis', href: '/category/analysis' },
  { label: 'Top DTC Brands', href: '/category/top-dtc-brands' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-nav-bg">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative py-5 text-sm font-medium tracking-wide text-nav-text/80 transition-colors duration-200 hover:text-nav-text"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile hamburger icon (placeholder, wired in US-005) */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-nav-text md:hidden"
            aria-label="Open menu"
            aria-expanded={false}
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  )
}
