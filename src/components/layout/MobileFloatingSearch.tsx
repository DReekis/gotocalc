"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CALCULATORS } from "@/lib/constants";

function getSearchScore(calc: typeof CALCULATORS[0], query: string): number {
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

export default function MobileFloatingSearch() {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCalcs = useMemo(() => {
    if (!normalizedQuery) {
      return CALCULATORS;
    }
    return CALCULATORS
      .map((calc, index) => ({
        calc,
        index,
        score: getSearchScore(calc, normalizedQuery),
      }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((a, b) => a.score - b.score || a.index - b.index)
      .map((entry) => entry.calc);
  }, [normalizedQuery]);

  const handleClose = () => {
    setIsMobileSearchOpen(false);
    // As requested, go back to home screen when closing via the cross button
    router.push("/");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-fab-global { display: none; }
        .mobile-search-overlay-global { display: none; }
        
        @media (max-width: 768px) {
          .mobile-fab-global {
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
          .mobile-fab-global:active {
            transform: scale(0.95);
          }
          .mobile-search-overlay-global {
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
          .mobile-search-overlay-global.open {
            opacity: 1;
            pointer-events: auto;
          }
          .mobile-search-sheet-global {
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
          .mobile-search-overlay-global.open .mobile-search-sheet-global {
            transform: translateY(0);
          }
          .mobile-search-results-global {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
          }
          .mobile-search-result-item-global {
            display: block;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border);
            text-decoration: none;
            color: inherit;
          }
          .mobile-search-result-item-global:last-child {
            border-bottom: none;
          }
        }
      `}} />

      <button 
        className="mobile-fab-global" 
        onClick={() => setIsMobileSearchOpen(true)}
        aria-label="Open search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>

      <div 
        className={`mobile-search-overlay-global ${isMobileSearchOpen ? 'open' : ''}`} 
        onClick={handleClose}
      >
        <div className="mobile-search-sheet-global" onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Search Calculators</h3>
            <button 
              onClick={handleClose}
              style={{ background: "none", border: "none", fontSize: "1.5rem", color: "var(--muted)", cursor: "pointer" }}
            >
              &times;
            </button>
          </div>
          
          <div className="mobile-search-results-global">
            {query && filteredCalcs.map((calc) => (
              <Link 
                key={`mobile-global-${calc.slug}`} 
                href={`/${calc.slug}`} 
                className="mobile-search-result-item-global"
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
    </>
  );
}
