import type { MetadataRoute } from 'next'
import { CALCULATORS, SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
    const calculators = CALCULATORS.map((calc) => ({
        url: `${SITE_URL}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...calculators,
    ]
}
