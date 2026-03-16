import type { Metadata } from 'next'
import { headingFont, bodyFont } from '@/lib/fonts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AnalyticsProvider } from '@/components/analytics-provider'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DTC Live | News, Strategies & Analysis for DTC Brands',
    template: '%s | DTC Live',
  },
  description:
    'The intelligence every DTC operator needs. Industry news, growth strategies, and data-driven analysis for direct-to-consumer brands on Shopify and beyond.',
  keywords: [
    'DTC',
    'direct to consumer',
    'ecommerce',
    'Shopify',
    'DTC brands',
    'ecommerce strategy',
    'DTC news',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DTC Live',
    title: 'DTC Live | News, Strategies & Analysis for DTC Brands',
    description:
      'The intelligence every DTC operator needs. Industry news, growth strategies, and data-driven analysis for direct-to-consumer brands.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DTC Live - Deep dives, smart signals and real DTC stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dtcliveUS',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${siteUrl}/#organization`,
        name: 'DTC Live',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
        sameAs: [
          'https://x.com/dtcliveUS',
          'https://linkedin.com/company/dtclive-us',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'DTC Live',
        publisher: { '@id': `${siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col font-body">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AnalyticsProvider />
      </body>
    </html>
  )
}
