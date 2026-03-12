type BadgeVariant = 'default' | 'primary' | 'outline'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-surface text-text-muted',
  primary:
    'bg-primary text-white',
  outline:
    'border border-primary text-primary bg-transparent',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium uppercase tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
