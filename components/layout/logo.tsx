import Link from 'next/link'

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline font-heading text-2xl tracking-tight ${className}`}
    >
      <span className="font-bold text-white">DTC</span>
      <span className="ml-1 font-bold text-primary">Live</span>
    </Link>
  )
}
