import Link from "next/link";
import { SITE_URL, type FAQItem } from "@/lib/constants";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface Props {
    title: string;
    subtitle: string;
    breadcrumbs: BreadcrumbItem[];
    children: React.ReactNode;
    formulaTitle?: string;
    formulaContent?: React.ReactNode;
    exampleTitle?: string;
    exampleContent?: React.ReactNode;
    definitionTitle?: string;
    definitionContent?: React.ReactNode;
    faqs?: FAQItem[];
}

export default function CalculatorShell({
    title,
    subtitle,
    breadcrumbs,
    children,
    formulaTitle,
    formulaContent,
    exampleTitle,
    exampleContent,
    definitionTitle,
    definitionContent,
    faqs,
}: Props) {
    return (
        <main style={{ margin: "0 auto", maxWidth: 800, padding: "2rem 1.5rem" }}>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumbs.map((crumb, i) => (
                        <li key={crumb.href}>
                            {i < breadcrumbs.length - 1 ? (
                                <>
                                    <Link href={crumb.href}>{crumb.label}</Link>
                                    <span aria-hidden="true">›</span>
                                </>
                            ) : (
                                <span className="current">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Hero */}
            <header style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        margin: "0 0 0.5rem",
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        color: "var(--muted)",
                        fontSize: "1.05rem",
                        lineHeight: 1.6,
                        margin: 0,
                    }}
                >
                    {subtitle}
                </p>
            </header>

            {/* Calculator (client component slot) */}
            <div className="calc-card">{children}</div>

            {/* E-E-A-T Content Sections */}
            <article className="content-section">
                {/* Definition */}
                {definitionTitle && definitionContent && (
                    <section>
                        <h2>{definitionTitle}</h2>
                        {definitionContent}
                    </section>
                )}

                {/* Formula */}
                {formulaTitle && formulaContent && (
                    <section>
                        <h2>{formulaTitle}</h2>
                        {formulaContent}
                    </section>
                )}

                {/* Example */}
                {exampleTitle && exampleContent && (
                    <section>
                        <h2>{exampleTitle}</h2>
                        {exampleContent}
                    </section>
                )}

                {/* FAQ */}
                {faqs && faqs.length > 0 && (
                    <section>
                        <h2>Frequently Asked Questions</h2>
                        {faqs.map((faq, i) => (
                            <details key={i} className="faq-item">
                                <summary>{faq.question}</summary>
                                <div className="faq-answer">{faq.answer}</div>
                            </details>
                        ))}
                    </section>
                )}
            </article>
        </main>
    );
}
