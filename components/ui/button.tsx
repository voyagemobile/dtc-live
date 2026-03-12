import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover',
  secondary:
    'bg-foreground text-white hover:bg-foreground/90 active:bg-foreground/80',
  ghost:
    'bg-transparent text-foreground hover:bg-surface active:bg-surface',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50'

/* -------------------------------------------------
   Button (renders <button>)
   ------------------------------------------------- */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)

/* -------------------------------------------------
   ButtonLink (renders <a> with button styling)
   ------------------------------------------------- */

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </a>
    )
  },
)
