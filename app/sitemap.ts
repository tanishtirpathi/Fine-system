import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.fine.tanishtirpathi.me',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://www.fine.tanishtirpathi.me/docs',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://www.fine.tanishtirpathi.me/login',
      lastModified: new Date(),
      priority: 0.7,
    },
  ]
}