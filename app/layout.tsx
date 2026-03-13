import type { Metadata } from 'next'
import { headingFont, bodyFont } from '@/lib/fonts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AnalyticsProvider } from '@/components/analytics-provider'
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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AnalyticsProvider />
      </body>
    </html>
  )
}
