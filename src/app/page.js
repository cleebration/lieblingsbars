"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import barsData from "../../data/bars.json";
import { getBarImageUrl } from "../lib/bar-images";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return barsData;
    return barsData.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.concept?.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">Lieblingsbars</span>
          <span className="nav-count">{barsData.length} Bars</span>
        </div>
      </nav>

      <section className="hero">
        <p className="hero-eyebrow">Eine fiktive Bar für jeden Augenblick</p>
        <h1>Lieb&shy;lings&shy;bars</h1>
        <p className="hero-sub">
          318 fiktive Bars — jede benannt nach einem deutschen Adjektiv auf -bar.
          Manche machbar, manche kaum vorstellbar.
        </p>
      </section>

      <div className="filter-bar">
        <div className="filter-inner">
          <input
            className="search-input"
            type="search"
            placeholder="Bar suchen — Name, Stadt, Konzept …"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="filter-count">
            {filtered.length} / {barsData.length}
          </span>
        </div>
      </div>

      <main className="bars-section">
        {filtered.length === 0 ? (
          <div className="empty-state">Keine Bar gefunden für „{search}"</div>
        ) : (
          <div className="bars-grid">
            {filtered.map((bar) => (
              <Link key={bar.slug} href={`/bar/${bar.slug}/`} className="bar-card">
                <div className="card-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="card-image"
                    src={getBarImageUrl(bar, 400, 225)}
                    alt={bar.name}
                    loading="lazy"
                    width={400}
                    height={225}
                  />
                </div>
                <div className="card-body">
                  <span className="card-number">#{String(bar.id).padStart(3, "0")}</span>
                  <h2 className="card-name">{bar.name}</h2>
                  <p className="card-tagline">{bar.tagline}</p>
                  <div className="card-meta">
                    <span className="card-city">{bar.city}</span>
                    <span className="card-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        © Lieblingsbars — Alle Bars sind fiktiv, alle Drinks erfunden, alle Träume echt.
      </footer>
    </>
  );
}
