import type { MetadataRoute } from 'next'
import reader from '@/lib/reader'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawArticles = await reader.collections.articles.all()
  const articleEntries: MetadataRoute.Sitemap = rawArticles
    .filter((a) => a.entry.date)
    .map((a) => ({
      url: `${siteUrl}/blog/${a.slug}`,
      lastModified: new Date(a.entry.date as string),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/competitions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    ...articleEntries,
  ]
}
