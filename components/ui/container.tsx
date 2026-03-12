type ContainerSize = 'default' | 'narrow' | 'wide'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: ContainerSize
}

const sizeStyles: Record<ContainerSize, string> = {
  narrow: 'max-w-[720px]',
  default: 'max-w-[1080px]',
  wide: 'max-w-[1280px]',
}

export function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
    >
      {children}
    </div>
  )
}
