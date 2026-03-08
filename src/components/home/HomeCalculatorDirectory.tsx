"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface HomeCalculatorItem {
  slug: string;
  title: string;
  description: string;
  category: "finance" | "health" | "math" | "education";
  categoryLabel: string;
}

interface Props {
  calculators: HomeCalculatorItem[];
}

interface ConnectionInfo {
  effectiveType?: string;
  saveData?: boolean;
}

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionInfo;
  mozConnection?: ConnectionInfo;
  webkitConnection?: ConnectionInfo;
};

interface NetworkProfile {
  slowConnection: boolean;
  idlePrefetchBudget: number;
  allowHoverPrefetch: boolean;
}

const categories = [
  { key: "finance", label: "Finance" },
  { key: "health", label: "Health" },
  { key: "math", label: "Math" },
  { key: "education", label: "Education" },
] as const;

const prefetchPriority = [
  "/finance/sip-calculator",
  "/finance/price-per-weight-calculator",
  "/health/bmi-calculator",
  "/math/percentage-calculator",
  "/finance/gst-calculator",
  "/education/cgpa-to-percentage-calculator",
  "/finance/mortgage-calculator",
  "/age-calculator",
  "/finance/income-tax-calculator-india",
  "/math/scientific-calculator",
] as const;

function getNetworkProfile(): NetworkProfile {
  const fallbackProfile: NetworkProfile = {
    slowConnection: false,
    idlePrefetchBudget: 2,
    allowHoverPrefetch: true,
  };

  if (typeof navigator === "undefined") {
    return fallbackProfile;
  }

  const nav = navigator as NavigatorWithConnection;
  const connection =
    nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  if (!connection) {
    return fallbackProfile;
  }

  const effectiveType = connection.effectiveType ?? "";
  const isSlow =
    connection.saveData === true ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g";

  if (isSlow) {
    return {
      slowConnection: true,
      idlePrefetchBudget: 0,
      allowHoverPrefetch: false,
    };
  }

  if (effectiveType === "3g") {
    return {
      slowConnection: false,
      idlePrefetchBudget: 2,
      allowHoverPrefetch: true,
    };
  }

  return {
    slowConnection: false,
    idlePrefetchBudget: 9,
    allowHoverPrefetch: true,
  };
}

function getSearchScore(calc: HomeCalculatorItem, query: string): number {
  const title = calc.title.toLowerCase();
  const slug = calc.slug.toLowerCase();
  const description = calc.description.toLowerCase();

  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  if (slug.includes(query)) return 3;
  if (description.includes(query)) return 4;

  return Number.POSITIVE_INFINITY;
}

function dedupePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  paths.forEach((path) => {
    if (!seen.has(path)) {
      seen.add(path);
      deduped.push(path);
    }
  });

  return deduped;
}

export default function HomeCalculatorDirectory({ calculators }: Props) {
  const router = useRouter();
  const prefetchedPathsRef = useRef<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [networkProfile] = useState<NetworkProfile>(getNetworkProfile);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCalcs = useMemo(() => {
    if (!normalizedQuery) {
      return calculators;
    }

    return calculators
      .map((calc, index) => ({
        calc,
        index,
        score: getSearchScore(calc, normalizedQuery),
      }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((a, b) => a.score - b.score || a.index - b.index)
      .map((entry) => entry.calc);
  }, [calculators, normalizedQuery]);

  const suggestedCalcs = useMemo(
    () => (normalizedQuery ? filteredCalcs.slice(0, 3) : []),
    [filteredCalcs, normalizedQuery],
  );

  const prefetchPath = useCallback(
    (path: string) => {
      if (prefetchedPathsRef.current.has(path)) {
        return;
      }

      prefetchedPathsRef.current.add(path);
      void router.prefetch(path);
    },
    [router],
  );

  const idlePrefetchPaths = useMemo(() => {
    const allPaths = calculators.map((calc) => `/${calc.slug}`);
    return dedupePaths([...prefetchPriority, ...allPaths]);
  }, [calculators]);

  useEffect(() => {
    if (networkProfile.idlePrefetchBudget <= 0) {
      return;
    }

    const targets = idlePrefetchPaths.slice(0, networkProfile.idlePrefetchBudget);
    if (targets.length === 0) {
      return;
    }

    let cancelled = false;
    let timeoutHandle: number | undefined;
    let idleHandle: number | undefined;

    const warmSequentially = () => {
      let cursor = 0;
      const run = () => {
        if (cancelled || cursor >= targets.length) {
          return;
        }

        prefetchPath(targets[cursor]);
        cursor += 1;
        timeoutHandle = window.setTimeout(run, 350);
      };

      run();
    };

    const win = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      idleHandle = win.requestIdleCallback(warmSequentially, { timeout: 1200 });
    } else {
      timeoutHandle = window.setTimeout(warmSequentially, 900);
    }

    return () => {
      cancelled = true;

      if (typeof timeoutHandle === "number") {
        window.clearTimeout(timeoutHandle);
      }

      if (
        typeof idleHandle === "number" &&
        typeof win.cancelIdleCallback === "function"
      ) {
        win.cancelIdleCallback(idleHandle);
      }
    };
  }, [idlePrefetchPaths, networkProfile.idlePrefetchBudget, prefetchPath]);

  useEffect(() => {
    if (!normalizedQuery || filteredCalcs.length === 0) {
      return;
    }

    const firstMatchPath = `/${filteredCalcs[0].slug}`;
    const timeoutHandle = window.setTimeout(
      () => prefetchPath(firstMatchPath),
      networkProfile.slowConnection ? 180 : 60,
    );

    return () => {
      window.clearTimeout(timeoutHandle);
    };
  }, [filteredCalcs, normalizedQuery, networkProfile.slowConnection, prefetchPath]);

  const resultLabel = normalizedQuery
    ? `Showing ${filteredCalcs.length} result${filteredCalcs.length === 1 ? "" : "s"} for "${query}".`
    : "";

  return (
    <>
      <section
        style={{
          marginBottom: "2.5rem",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          borderRadius: 8,
          padding: "0.875rem",
        }}
      >
        <div
          role="search"
          aria-label="Search calculators"
          style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search calculators (e.g. sip, bmi, gst)"
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Search all calculators"
            style={{
              flex: "1 1 20rem",
              minWidth: 0,
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--bg)",
              color: "var(--fg)",
              padding: "0.625rem 0.75rem",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="button"
            onClick={() => setQuery("")}
            disabled={!query}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: query ? "var(--muted)" : "var(--border)",
              padding: "0.625rem 0.875rem",
              fontSize: "0.9rem",
              lineHeight: 1.1,
            }}
          >
            Clear
          </button>
        </div>

        {suggestedCalcs.length > 0 && (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--bg)",
              marginTop: "0.75rem",
              padding: "0.75rem",
            }}
          >
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.8rem",
                textAlign: "center",
                margin: "0 0 0.5rem",
              }}
            >
              Did you mean?
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {suggestedCalcs.map((calc) => {
                const path = `/${calc.slug}`;
                return (
                  <Link
                    key={`suggested-${calc.slug}`}
                    href={path}
                    prefetch={false}
                    onFocus={() => prefetchPath(path)}
                    onTouchStart={() => prefetchPath(path)}
                    onMouseEnter={() => {
                      if (networkProfile.allowHoverPrefetch) {
                        prefetchPath(path);
                      }
                    }}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 999,
                      padding: "0.4rem 0.7rem",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                      background: "var(--surface)",
                    }}
                  >
                    {calc.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {resultLabel && (
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.8rem",
              marginTop: "0.625rem",
            }}
            aria-live="polite"
          >
            {resultLabel}
          </p>
        )}
      </section>

      {filteredCalcs.length === 0 ? (
        <section
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            No calculator found for {query}. Try tax, age, sip, or percentage.
          </p>
        </section>
      ) : (
        categories.map((category) => {
          const calcsInCategory = filteredCalcs.filter(
            (calc) => calc.category === category.key,
          );
          if (calcsInCategory.length === 0) {
            return null;
          }

          return (
            <section key={category.key} style={{ marginBottom: "2.5rem" }}>
              <h2
                style={{
                  color: "var(--muted)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  margin: "0 0 0.75rem",
                  textTransform: "uppercase",
                }}
              >
                {category.label}
              </h2>

              <div
                className="calc-grid"
                style={{
                  display: "grid",
                  gap: "1px",
                  gridTemplateColumns: "1fr",
                  background: "var(--border)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {calcsInCategory.map((calc) => {
                  const path = `/${calc.slug}`;

                  return (
                    <Link
                      key={calc.slug}
                      href={path}
                      prefetch={false}
                      onFocus={() => prefetchPath(path)}
                      onTouchStart={() => prefetchPath(path)}
                      onMouseEnter={() => {
                        if (networkProfile.allowHoverPrefetch) {
                          prefetchPath(path);
                        }
                      }}
                      style={{
                        background: "var(--surface)",
                        color: "inherit",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem 1.25rem",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            marginBottom: "0.125rem",
                          }}
                        >
                          {calc.title}
                        </div>
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {calc.description.length > 80
                            ? `${calc.description.slice(0, 80)}...`
                            : calc.description}
                        </div>
                      </div>
                      <span
                        style={{
                          color: "var(--muted)",
                          fontSize: "1rem",
                          flexShrink: 0,
                          marginLeft: "1rem",
                        }}
                        aria-hidden="true"
                      >
                        {"->"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
