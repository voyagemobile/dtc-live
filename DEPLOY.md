# Deployment Guide

## Vercel Project

**Project name:** dtc-live
**Project ID:** prj_Zx3pQtHylrR1Mn9Un73FVbolRsWK
**Team:** VYG (voyagesms)
**Framework:** Next.js
**Node version:** 24.x
**GitHub integration:** voyagemobile/dtc-live, production branch: main
**Current live URL:** https://dtc-live.vercel.app
**Vercel dashboard:** https://vercel.com/voyagesms/dtc-live

Auto-deploys are enabled: every push to `main` triggers a production deployment, and every pull request branch gets a preview deployment.

**IMPORTANT:** Never run `vercel deploy` from the CLI. Always push to GitHub and let Vercel auto-deploy.

## Environment Variables

The following environment variables must be set in the Vercel project settings (Settings > Environment Variables):

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GHOST_API_URL` | Plain | Yes | Ghost CMS API URL (e.g. `https://dtc-live.ghost.io`) |
| `GHOST_CONTENT_API_KEY` | Encrypted | Yes | Ghost Content API key from Ghost Admin |
| `GHOST_ADMIN_API_KEY` | Encrypted | Yes | Ghost Admin API key for newsletter subscriptions (format: `id:secret`) |

All variables should be set for all targets: production, preview, and development.

### Getting the Ghost API Keys

1. Log in to Ghost Admin at `https://dtc-live.ghost.io/ghost/`
2. Go to Settings > Integrations
3. Click "Add custom integration" (or find the existing dtc-live integration)
4. Copy the **Content API Key** and **Admin API Key**
5. In Vercel project settings, set `GHOST_CONTENT_API_KEY` and `GHOST_ADMIN_API_KEY`

The Admin API Key is used server-side only for the newsletter subscribe endpoint (`/api/subscribe`). It is never exposed to the browser.

## Build Commands

Vercel uses Next.js framework detection automatically. No `vercel.json` is required.

- Build: `next build` (via `npm run build`)
- Output: `.next/` directory
- Install: `npm install`

Local verification commands:
```bash
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
npm run build       # Full production build
```

All three pass as of the US-009 deployment setup (2026-03-12).

## DNS Cutover

The site will be accessible at a Vercel-generated URL (e.g. `dtc-live.vercel.app`) immediately after the first successful deployment. To point `dtc.live` to Vercel:

### Option A: CNAME (recommended for subdomains like www.dtc.live)

Add a CNAME record in your DNS provider:
```
www.dtc.live  CNAME  cname.vercel-dns.com
```

### Option B: Apex domain (dtc.live without www)

For the apex domain, DNS providers that support ALIAS/ANAME records:
```
dtc.live  ALIAS  cname.vercel-dns.com
```

For providers that only support A records, use Vercel's IP addresses:
```
dtc.live  A  76.76.21.21
```

### Adding the domain in Vercel

**Do this BEFORE updating DNS.** Vercel must verify the domain to provision the SSL certificate. Updating DNS before adding the domain in Vercel will cause a downtime gap.

1. In the Vercel dashboard at https://vercel.com/voyagesms/dtc-live, go to Settings > Domains
2. Add `dtc.live` and `www.dtc.live`
3. Vercel will show the required DNS values and auto-provision SSL

### Downtime window

DNS propagation typically takes 5-60 minutes but can take up to 48 hours. To minimize downtime:

1. Lower the TTL on the existing `dtc.live` DNS records to 300 seconds at least 24 hours before cutover
2. Verify the Vercel preview URL renders all content correctly (articles, navigation, category pages)
3. Update DNS records during a low-traffic window
4. Monitor the site for 30 minutes after DNS propagation completes
5. The old Ghost site will continue serving until DNS propagates

SSL certificates are auto-provisioned by Vercel (Let's Encrypt) once the domain is verified.

### Verifying the cutover

After DNS propagates, confirm the site is live and serving correctly:

```bash
# Check HTTP status and SSL
curl -I https://dtc.live

# Expect: HTTP/2 200, server: Vercel
```

Also verify manually:
- Homepage loads with articles
- A category page loads (e.g. https://dtc.live/category/brand-strategy)
- An article page loads without errors
- Navigation mega menu works

## Preview Deployments

Every pull request automatically gets a preview deployment at a unique URL like:
```
https://dtc-live-git-{branch-name}-voyagesms.vercel.app
```

Preview deploys use the same environment variables as production (all targets set to production/preview/development).

## Rollback

To roll back to a previous deployment:

**Via dashboard (recommended):** Go to https://vercel.com/voyagesms/dtc-live, open the Deployments tab, find the previous successful deployment, and click "Promote to Production".

**Via CLI:**
```bash
vercel rollback --scope voyagesms
```

This promotes the most recent previous production deployment. For a specific deployment, use "Promote to Production" in the dashboard instead.
