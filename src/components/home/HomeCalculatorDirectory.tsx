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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

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
      <style dangerouslySetInnerHTML={{
        __html: `
        .desktop-search { display: block; }
        .mobile-fab { display: none; }
        .mobile-search-overlay { display: none; }
        .calc-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; }
        
        @media (max-width: 768px) {
          .desktop-search { display: none; }
          .calc-grid { grid-template-columns: 1fr !important; }
          .mobile-fab {
            display: flex;
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
            background: var(--fg);
            color: var(--bg);
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            border: none;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .mobile-fab:active {
            transform: scale(0.95);
          }
          .mobile-search-overlay {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 1001;
            flex-direction: column;
            justify-content: flex-end;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
          }
          .mobile-search-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }
          .mobile-search-sheet {
            background: var(--bg);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            padding: 1.5rem;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            max-height: 85vh;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          }
          .mobile-search-overlay.open .mobile-search-sheet {
            transform: translateY(0);
          }
          .mobile-search-results {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
          }
          .mobile-search-result-item {
            display: block;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border);
            text-decoration: none;
            color: inherit;
          }
          .mobile-search-result-item:last-child {
            border-bottom: none;
          }
        }
      `}} />

      {/* Mobile FAB */}
      <button
        className="mobile-fab"
        onClick={() => setIsMobileSearchOpen(true)}
        aria-label="Open search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>

      {/* Mobile Search Overlay */}
      <div
        className={`mobile-search-overlay ${isMobileSearchOpen ? 'open' : ''}`}
        onClick={() => setIsMobileSearchOpen(false)}
      >
        <div className="mobile-search-sheet" onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Search Calculators</h3>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              style={{ background: "none", border: "none", fontSize: "1.5rem", color: "var(--muted)", cursor: "pointer" }}
            >
              &times;
            </button>
          </div>

          <div className="mobile-search-results">
            {query && filteredCalcs.map((calc) => (
              <Link
                key={`mobile-${calc.slug}`}
                href={`/${calc.slug}`}
                className="mobile-search-result-item"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--fg)", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>{calc.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{calc.description}</div>
              </Link>
            ))}
            {query && filteredCalcs.length === 0 && (
              <div style={{ color: "var(--muted)", padding: "1rem 0" }}>No results found.</div>
            )}
            {!query && (
              <div style={{ color: "var(--muted)", padding: "1rem 0" }}>Type to start searching...</div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search (e.g. sip, bmi, gst)"
              autoComplete="off"
              enterKeyHint="search"
              style={{
                flex: "1 1 auto",
                minWidth: 0,
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                color: "var(--fg)",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Search */}
      <section
        className="desktop-search"
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
                            fontWeight: 800,
                            fontSize: "1.25rem",
                            color: "var(--fg)",
                            letterSpacing: "-0.02em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {calc.title}
                        </div>
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
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
                        {""}
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
