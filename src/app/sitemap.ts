import { MetadataRoute } from "next";
import { SITE_URL, CALCULATORS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
    const calculatorRoutes = CALCULATORS.map((calc) => ({
        url: `${SITE_URL}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        ...calculatorRoutes,
    ];
}
