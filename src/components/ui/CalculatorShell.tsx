import Link from "next/link";
import "@/app/calculator.css";
import { type FAQItem } from "@/lib/constants";

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
        <main style={{ margin: "0 auto", maxWidth: 720, padding: "1.5rem 1rem 3rem" }}>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumbs.map((crumb, i) => (
                        <li key={i}>
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
            <header style={{ marginBottom: "1.5rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(1.5rem, 4vw, 2rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        margin: "0 0 0.375rem",
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        color: "var(--muted)",
                        fontSize: "0.925rem",
                        lineHeight: 1.5,
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
                {definitionTitle && definitionContent && (
                    <section>
                        <h2>{definitionTitle}</h2>
                        {definitionContent}
                    </section>
                )}

                {formulaTitle && formulaContent && (
                    <section>
                        <h2>{formulaTitle}</h2>
                        {formulaContent}
                    </section>
                )}

                {exampleTitle && exampleContent && (
                    <section>
                        <h2>{exampleTitle}</h2>
                        {exampleContent}
                    </section>
                )}

                {faqs && faqs.length > 0 && (
                    <section>
                        <h2>People Also Ask</h2>
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
