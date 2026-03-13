'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

/**
 * Thin wrapper around next-themes ThemeProvider.
 *
 * Must be a Client Component because next-themes uses browser APIs.
 * Placed here so layout.tsx (a Server Component) can import it without
 * pulling next-themes into the server bundle.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
