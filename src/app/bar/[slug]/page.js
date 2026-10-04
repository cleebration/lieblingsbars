import Link from "next/link";
import { notFound } from "next/navigation";
import bars from "../../../../../data/bars.json";
import CopyButton from "../../../../components/CopyButton";

export async function generateStaticParams() {
  return bars.map((bar) => ({ slug: bar.slug }));
}

export async function generateMetadata({ params }) {
  const bar = bars.find((b) => b.slug === params.slug);
  if (!bar) return {};
  return {
    title: `${bar.name} – MyW Lieblingsbars`,
    description: bar.tagline,
  };
}

export default function BarPage({ params }) {
  const bar = bars.find((b) => b.slug === params.slug);
  if (!bar) notFound();

  const paragraphs = bar.blogContent
    ? bar.blogContent.split("\n\n").filter(Boolean)
    : [];

  const currentIndex = bars.findIndex((b) => b.slug === params.slug);
  const prevBar = currentIndex > 0 ? bars[currentIndex - 1] : null;
  const nextBar = currentIndex < bars.length - 1 ? bars[currentIndex + 1] : null;

  return (
    <div className="detail-layout">
      {/* ── Nav ──────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          MyW <span>– Meine Lieblingsbars</span>
        </Link>
        <div className="nav-count">
          #{String(bar.id).padStart(3, "0")} von {bars.length}
        </div>
      </nav>

      {/* ── Back ─────────────────────────────────── */}
      <Link href="/" className="back-btn">
        ← Alle Bars
      </Link>

      {/* ── Hero ─────────────────────────────────── */}
      <div className="detail-hero">
        {/* If image exists, show it; otherwise placeholder */}
        <div className="detail-hero-placeholder" />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <div className="detail-number fade-up">
            Bar #{String(bar.id).padStart(3, "0")} ·{" "}
            {bar.publishDate}
          </div>
          <h1 className="detail-name fade-up fade-up-1">{bar.name}</h1>
          <p className="detail-tagline fade-up fade-up-2">{bar.tagline}</p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <article className="detail-body">
        {/* Meta */}
        <div className="detail-meta fade-up">
          <div className="meta-item">
            <span className="meta-label">Stadt</span>
            <span className="meta-value">{bar.city}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Viertel</span>
            <span className="meta-value">{bar.neighborhood}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Signature Drink</span>
            <span className="meta-value">{bar.signatureDrink}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Veröffentlicht</span>
            <span className="meta-value">{bar.publishDate}</span>
          </div>
        </div>

        {/* Concept */}
        <p className="detail-concept fade-up">{bar.concept}</p>

        {/* Blog */}
        <h2 className="blog-title fade-up">{bar.blogTitle}</h2>
        <div className="blog-content fade-up">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Signature Drink */}
        <div className="signature-drink fade-up">
          <div className="drink-label">Signature Drink</div>
          <div className="drink-name">{bar.signatureDrink}</div>
          <div className="drink-desc">{bar.signatureDrinkDescription}</div>
        </div>

        {/* Image Prompt for Nano Banana */}
        <div className="image-prompt-box fade-up">
          <div className="prompt-label">Nano Banana Image Prompt</div>
          <p className="prompt-text">{bar.imagePrompt}</p>
          <CopyButton text={bar.imagePrompt} />
        </div>

        {/* Social Preview */}
        <SocialPreviews bar={bar} />
      </article>

      {/* ── Prev / Next ───────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          background: "var(--border)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {prevBar ? (
          <Link
            href={`/bar/${prevBar.slug}/`}
            style={{
              padding: "2rem",
              background: "var(--bg-card)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-card)")
            }
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              ← Vorherige Bar
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                color: "var(--text-primary)",
              }}
            >
              {prevBar.name}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextBar ? (
          <Link
            href={`/bar/${nextBar.slug}/`}
            style={{
              padding: "2rem",
              background: "var(--bg-card)",
              textAlign: "right",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-card)")
            }
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Nächste Bar →
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                color: "var(--text-primary)",
              }}
            >
              {nextBar.name}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <Link href="/" className="footer-logo">
          MyW – Meine Lieblingsbars
        </Link>
        <div className="footer-info">
          {bars.length} Bars · Täglich eine neue Bar auf Social Media
        </div>
      </footer>
    </div>
  );
}

function SocialPreviews({ bar }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        Social Media Content
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[
          { label: "X / Twitter", content: bar.tweet, icon: "𝕏" },
          { label: "Instagram", content: bar.instagram, icon: "◎" },
          { label: "Facebook", content: bar.facebook, icon: "f" },
        ].map(({ label, content, icon }) => (
          <div
            key={label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                }}
              >
                {icon} {label}
              </span>
              <CopyButton text={content} small />
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
