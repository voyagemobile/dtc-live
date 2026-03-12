import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DTC Live',
  description: 'The DTC industry\'s leading media brand.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
