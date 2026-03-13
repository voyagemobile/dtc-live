import type { Metadata } from 'next'
import { headingFont, bodyFont } from '@/lib/fonts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'DTC Live',
  description: 'The DTC industry\'s leading media brand.',
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'DTC Live RSS Feed' }],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning is required by next-themes: the server renders
    // with no class, then the client immediately adds "dark" or "light" before
    // React hydration completes, causing a harmless mismatch that we suppress.
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AnalyticsProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
