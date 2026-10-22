"use client";

import { useState, useEffect, useRef } from "react";
import barsData from "../../../data/bars.json";
import { getBarImageUrl } from "../../lib/bar-images";

const BARS_WITHOUT_LOCAL = barsData.filter((b) => !getBarImageUrl(b));

export default function RedaktionPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [manifest, setManifest] = useState({});
  const [uploading, setUploading] = useState(null); // slug currently uploading
  const [uploaded, setUploaded] = useState({}); // slug -> url
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("alle"); // "alle" | "fehlt" | "bereit"
  const fileInputRef = useRef(null);
  const [pendingSlug, setPendingSlug] = useState(null);

  useEffect(() => {
    fetch("/api/manifest")
      .then((r) => r.ok ? r.json() : {})
      .then((m) => { setManifest(m); setUploaded(m); })
      .catch(() => {});
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (password.trim()) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Bitte Passwort eingeben.");
    }
  }

  function triggerUpload(slug) {
    setPendingSlug(slug);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !pendingSlug) return;
    e.target.value = "";

    setUploading(pendingSlug);
    try {
      const fd = new FormData();
      fd.append("password", password);
      fd.append("slug", pendingSlug);
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
      setUploaded((prev) => ({ ...prev, [pendingSlug]: data.url }));
    } catch (err) {
      alert(`Fehler: ${err.message}`);
    } finally {
      setUploading(null);
      setPendingSlug(null);
    }
  }

  const bars = BARS_WITHOUT_LOCAL.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.slug.includes(q) ||
      b.city?.toLowerCase().includes(q);
    const hasImage = !!uploaded[b.slug];
    const matchFilter =
      filter === "alle" ||
      (filter === "fehlt" && !hasImage) ||
      (filter === "bereit" && hasImage);
    return matchSearch && matchFilter;
  });

  const totalDone = Object.keys(uploaded).filter((s) =>
    BARS_WITHOUT_LOCAL.some((b) => b.slug === s)
  ).length;

  if (!authenticated) {
    return (
      <div className="redaktion-login">
        <div className="login-box">
          <h1>Redaktion</h1>
          <p>Passwort eingeben um Fotos hochzuladen.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              autoFocus
            />
            {authError && <p className="login-error">{authError}</p>}
            <button type="submit" className="login-btn">Einloggen</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="redaktion-page">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">← Lieblingsbars</a>
          <span className="nav-count">Redaktion</span>
        </div>
      </nav>

      <div className="redaktion-header">
        <h1>Fotos hochladen</h1>
        <p className="redaktion-sub">
          {totalDone} von {BARS_WITHOUT_LOCAL.length} Bars haben ein Foto.
          {BARS_WITHOUT_LOCAL.length - totalDone} noch offen.
        </p>
        <div className="redaktion-progress">
          <div
            className="redaktion-progress-bar"
            style={{ width: `${(totalDone / BARS_WITHOUT_LOCAL.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="redaktion-controls">
        <input
          type="search"
          placeholder="Bar suchen …"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="redaktion-filter-tabs">
          {["alle", "fehlt", "bereit"].map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "alle" ? "Alle" : f === "fehlt" ? "Fehlt noch" : "Bereit"}
            </button>
          ))}
        </div>
      </div>

      <main className="redaktion-grid">
        {bars.map((bar) => {
          const imgUrl = uploaded[bar.slug];
          const isUploading = uploading === bar.slug;
          return (
            <div key={bar.slug} className={`redaktion-card${imgUrl ? " has-image" : ""}`}>
              <div className="redaktion-card-img">
                {imgUrl ? (
                  <img src={imgUrl} alt={bar.name} />
                ) : (
                  <div className="redaktion-placeholder">
                    <span className="redaktion-icon">📷</span>
                  </div>
                )}
              </div>
              <div className="redaktion-card-body">
                <span className="card-number">#{String(bar.id).padStart(3, "0")}</span>
                <strong className="card-name">{bar.name}</strong>
                <span className="card-city">{bar.city}</span>
                <code className="redaktion-slug">{bar.slug}</code>
                {bar.imagePrompt && (
                  <p className="redaktion-prompt">{bar.imagePrompt}</p>
                )}
                <button
                  className={`redaktion-upload-btn${imgUrl ? " replace" : ""}`}
                  onClick={() => triggerUpload(bar.slug)}
                  disabled={isUploading}
                >
                  {isUploading ? "Lädt hoch …" : imgUrl ? "Ersetzen" : "Foto hochladen"}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
