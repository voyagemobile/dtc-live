import type { ReactNode } from 'react'
import Link from 'next/link'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  role?: string
}

/**
 * Shared navigation link with the editorial underline hover effect.
 * Used by both the desktop mega menu and mobile overlay for consistent styling.
 */
export function NavLink({ href, children, className = '', onClick, role }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role={role}
      className={`group relative inline-block text-sm font-medium tracking-wide text-nav-text/80 transition-colors duration-200 hover:text-nav-text ${className}`}
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  )
}
