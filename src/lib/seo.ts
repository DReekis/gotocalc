import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, type CalculatorMeta, type FAQItem } from "./constants";

/* ─── Page Metadata Generator ─── */

export function generateCalculatorMetadata(calc: CalculatorMeta): Metadata {
    const url = `${SITE_URL}/${calc.slug}`;

    return {
        title: `${calc.title} — Free Online Tool`,
        description: calc.description,
        alternates: { canonical: url },
        robots: { index: true, follow: true },
        openGraph: {
            title: `${calc.title} | ${SITE_NAME}`,
            description: calc.description,
            url,
            siteName: SITE_NAME,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: `${calc.title} | ${SITE_NAME}`,
            description: calc.description,
        },
    };
}

/* ─── JSON-LD Schema Generators ─── */

export function generateWebAppSchema(calc: CalculatorMeta) {
    return {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/${calc.slug}#app`,
        name: calc.title,
        description: calc.description,
        url: `${SITE_URL}/${calc.slug}`,
        applicationCategory: calc.applicationCategory,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: "100% Client-Side Privacy, Zero Ads, Instant Calculation, System Font Stack for Fast Loading",
        author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}

export function generateFAQSchema(faqs: FAQItem[]) {
    return {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
            },
        })),
    };
}

export function generateBreadcrumbSchema(
    crumbs: { name: string; url: string }[]
) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.url,
        })),
    };
}

export function buildSchemaGraph(
    calc: CalculatorMeta,
    extraGraph: Record<string, unknown>[] = []
) {
    const crumbs = [
        { name: "Home", url: SITE_URL },
        {
            name: calc.categoryLabel,
            url: `${SITE_URL}/${calc.category}`,
        },
        {
            name: calc.title,
            url: `${SITE_URL}/${calc.slug}`,
        },
    ];

    return JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            generateWebAppSchema(calc),
            generateFAQSchema(calc.faqs),
            generateBreadcrumbSchema(crumbs),
            ...extraGraph,
        ],
    });
}
