import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export const metadata: Metadata = {
  title: 'Design System — DTC Live',
  description: 'Visual QA page for the DTC Live design system.',
  robots: 'noindex',
}

/* ─── helpers ─────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-12 border-b border-border last:border-b-0">
      <h2 className="font-heading text-2xl font-bold mb-8">{title}</h2>
      {children}
    </section>
  )
}

function ColorSwatch({ name, variable, hex }: { name: string; variable: string; hex: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-lg border border-border"
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-medium text-text-headline">{name}</p>
      <p className="text-xs text-text-caption font-mono">{variable}</p>
      <p className="text-xs text-text-muted font-mono">{hex}</p>
    </div>
  )
}

/* ─── page ────────────────────────────────────── */

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <Container size="wide">
        <header className="pb-12 border-b border-border mb-0">
          <h1 className="font-heading text-5xl font-bold tracking-tight mb-2">
            Design System
          </h1>
          <p className="text-text-muted text-lg">
            DTC Live visual reference. Tokens, typography, and components.
          </p>
        </header>

        {/* ── Color Palette ────────────────────── */}
        <Section title="Color Palette">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Brand
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <ColorSwatch name="Primary" variable="--color-primary" hex="#ff0f64" />
                <ColorSwatch name="Primary Hover" variable="--color-primary-hover" hex="#e00d5a" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Backgrounds &amp; Surfaces
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <ColorSwatch name="Background" variable="--color-background" hex="#ffffff" />
                <ColorSwatch name="Foreground" variable="--color-foreground" hex="#0a0a0a" />
                <ColorSwatch name="Surface" variable="--color-surface" hex="#f5f5f5" />
                <ColorSwatch name="Surface Elevated" variable="--color-surface-elevated" hex="#ffffff" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Text Hierarchy
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <ColorSwatch name="Headline" variable="--color-text-headline" hex="#0a0a0a" />
                <ColorSwatch name="Body" variable="--color-text-body" hex="#1a1a1a" />
                <ColorSwatch name="Muted" variable="--color-text-muted" hex="#6b6b6b" />
                <ColorSwatch name="Caption" variable="--color-text-caption" hex="#999999" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Navigation &amp; Borders
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <ColorSwatch name="Nav Background" variable="--color-nav-bg" hex="#0a0a0a" />
                <ColorSwatch name="Nav Text" variable="--color-nav-text" hex="#ffffff" />
                <ColorSwatch name="Border" variable="--color-border" hex="#e5e5e5" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Typography ───────────────────────── */}
        <Section title="Typography">
          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-6">
                Heading Font: Playfair Display
              </h3>
              <div className="space-y-4">
                <h1 className="font-heading text-6xl font-bold">h1 — The future of DTC</h1>
                <h2 className="font-heading text-5xl font-bold">h2 — Industry insights</h2>
                <h3 className="font-heading text-4xl font-semibold">h3 — Brand stories</h3>
                <h4 className="font-heading text-3xl font-semibold">h4 — Growth strategies</h4>
                <h5 className="font-heading text-2xl font-medium">h5 — Weekly roundup</h5>
                <h6 className="font-heading text-xl font-medium">h6 — Quick takes</h6>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-6">
                Body Font: Source Serif 4
              </h3>
              <div className="max-w-prose space-y-4">
                <p className="text-lg leading-relaxed text-text-body">
                  Body large (18px) — Direct-to-consumer brands are rewriting the rules of retail.
                  From bootstrapped startups to billion-dollar exits, the stories that matter most
                  are the ones built on real customer relationships.
                </p>
                <p className="text-base leading-relaxed text-text-body">
                  Body default (16px) — Every brand has a founding story worth telling. DTC Live
                  captures those stories with the depth and nuance they deserve, going beyond
                  headlines to explore the strategies that actually work.
                </p>
                <p className="text-sm text-text-muted">
                  Body small / muted (14px) — Published 3 days ago. 8 min read.
                </p>
                <p className="text-xs text-text-caption">
                  Caption (12px) — Photography by Studio DTC. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges ───────────────────────────── */}
        <Section title="Badges">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Variants (size: sm)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" size="sm">Growth</Badge>
                <Badge variant="primary" size="sm">Trending</Badge>
                <Badge variant="outline" size="sm">Community</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Variants (size: md)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" size="md">Growth</Badge>
                <Badge variant="primary" size="md">Trending</Badge>
                <Badge variant="outline" size="md">Community</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Buttons ──────────────────────────── */}
        <Section title="Buttons">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Variants (size: md)
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                Sizes (variant: primary)
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-text-muted mb-4">
                States
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Enabled</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Container Widths ─────────────────── */}
        <Section title="Container Widths">
          <div className="space-y-6">
            {(['narrow', 'default', 'wide'] as const).map((size) => (
              <div key={size}>
                <p className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wide">
                  {size} {size === 'narrow' ? '(720px)' : size === 'default' ? '(1080px)' : '(1280px)'}
                </p>
                <Container size={size}>
                  <div className="bg-surface border border-border rounded-lg p-4 text-center text-sm text-text-muted">
                    Container ({size})
                  </div>
                </Container>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </main>
  )
}
