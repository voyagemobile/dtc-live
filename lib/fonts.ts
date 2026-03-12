import { Playfair_Display, Source_Serif_4 } from 'next/font/google'

export const headingFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
