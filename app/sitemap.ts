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

  // Static homepage entry
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Article pages — one entry per post
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at ?? post.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Category pages — one entry per public tag (exclude internal Ghost tags)
  const tagEntries: MetadataRoute.Sitemap = tags
    .filter((tag) => tag.visibility === 'public')
    .map((tag) => ({
      url: `${BASE_URL}/category/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  // Author pages — one entry per author
  const authorEntries: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${BASE_URL}/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...postEntries, ...tagEntries, ...authorEntries]
}
