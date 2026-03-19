import { MetadataRoute } from 'next'
import { getPosts, getTags, getAuthors } from '@/lib/ghost'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dtc.live'

export const revalidate = 3600 // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postsData, tags, authors] = await Promise.all([
    getPosts({ limit: 1000 }),
    getTags(),
    getAuthors(),
  ])

  const posts = postsData.posts

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date('2026-03-13'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date('2026-03-13'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Article pages — one entry per post
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at ?? post.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Category pages — only include tags with enough content to be worth indexing
  const tagEntries: MetadataRoute.Sitemap = tags
    .filter((tag) => tag.visibility === 'public' && (tag.count?.posts ?? 0) >= 3)
    .map((tag) => ({
      url: `${BASE_URL}/category/${tag.slug}`,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

  // Author pages — one entry per author with meaningful content
  const authorEntries: MetadataRoute.Sitemap = authors
    .filter((author) => (author.count?.posts ?? 0) >= 2)
    .map((author) => ({
      url: `${BASE_URL}/author/${author.slug}`,
      changeFrequency: 'monthly',
      priority: 0.3,
    }))

  return [...staticEntries, ...postEntries, ...tagEntries, ...authorEntries]
}
