"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import bars from "../../../data/bars.json";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return bars;
    const q = query.toLowerCase();
    return bars.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.concept?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      {/* ── Navigation ───────────────────────────── */}
      <nav className="nav">
        <div className="nav-logo">
          MyW <span>– Meine Lieblingsbars</span>
        </div>
        <div className="nav-count">
          {bars.length} Bars · A bis Z
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero fade-up">
        <div className="hero-label">Das vollständige Bar-Universum</div>
        <h1>
          Meine<br />
          <em>Lieblings</em>
          <br />
          bars.
        </h1>
        <p className="hero-desc">
          Von der Abbaubar bis zur Zuweisbar — {bars.length} fiktive Bars, jede
          ein Universum. Jede ein Blogbeitrag. Jede ein Abend, der noch nicht
          stattgefunden hat.
        </p>
      </section>

      {/* ── Filter ───────────────────────────────── */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="Suche nach Bar-Namen, Stadt, Konzept…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="filter-count">
          {filtered.length} / {bars.length} Bars
        </span>
      </div>

      {/* ── Grid ─────────────────────────────────── */}
      <main className="bars-grid">
        {filtered.map((bar) => (
          <Link key={bar.slug} href={`/bar/${bar.slug}/`} className="bar-card">
            {bar.slug && (
              <div className="card-image-placeholder">
                <span>🍸</span>
              </div>
            )}
            <div className="card-number">#{String(bar.id).padStart(3, "0")}</div>
            <div className="card-name">{bar.name}</div>
            <div className="card-tagline">{bar.tagline}</div>
            <div className="card-city">
              {bar.city} · {bar.neighborhood}
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "4rem 2.5rem",
              textAlign: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
            }}
          >
            Keine Bars gefunden für „{query}"
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-logo">MyW – Meine Lieblingsbars</div>
        <div className="footer-info">
          {bars.length} Bars · Bilder via Nano Banana
          <br />
          Täglich eine neue Bar auf Instagram, X & Facebook
        </div>
      </footer>
    </>
  );
}
