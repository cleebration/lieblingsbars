import Link from "next/link";
import { notFound } from "next/navigation";
import barsData from "../../../../data/bars.json";
import CopyButton from "../../../components/CopyButton";
import { getBarImageUrl } from "../../../lib/bar-images";

export async function generateStaticParams() {
  return barsData.map((bar) => ({ slug: bar.slug }));
}

export async function generateMetadata({ params }) {
  const bar = barsData.find((b) => b.slug === params.slug);
  if (!bar) return {};
  return {
    title: `${bar.name} — Lieblingsbars`,
    description: bar.tagline,
    openGraph: {
      title: bar.name,
      description: bar.tagline,
      images: [getBarImageUrl(bar, 1200, 630)],
    },
  };
}

export default function BarPage({ params }) {
  const idx = barsData.findIndex((b) => b.slug === params.slug);
  if (idx === -1) notFound();

  const bar = barsData[idx];
  const prev = idx > 0 ? barsData[idx - 1] : null;
  const next = idx < barsData.length - 1 ? barsData[idx + 1] : null;

  const paragraphs = bar.blogContent
    ? bar.blogContent.split(/\n\n+/).filter(Boolean)
    : [];

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Lieblingsbars</Link>
          <span className="nav-count">#{String(bar.id).padStart(3, "0")} / {barsData.length}</span>
        </div>
      </nav>

      {/* Hero image */}
      <div className="detail-hero-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="detail-hero-img"
          src={getBarImageUrl(bar, 1200, 600)}
          alt={bar.name}
          width={1200}
          height={600}
        />
      </div>

      <main className="detail-layout">
        <Link href="/" className="detail-back">← Alle Bars</Link>

        <p className="detail-eyebrow">Bar #{String(bar.id).padStart(3, "0")}</p>
        <h1 className="detail-name">{bar.name}</h1>
        <p className="detail-tagline">{bar.tagline}</p>

        <div className="detail-meta-row">
          <div className="detail-meta-item">
            <span className="meta-label">Stadt</span>
            <span className="meta-value">{bar.city}</span>
          </div>
          <div className="detail-meta-item">
            <span className="meta-label">Viertel</span>
            <span className="meta-value">{bar.neighborhood}</span>
          </div>
          <div className="detail-meta-item">
            <span className="meta-label">Eröffnet</span>
            <span className="meta-value">{bar.publishDate}</span>
          </div>
        </div>

        {bar.concept && (
          <div className="detail-concept">
            <p>{bar.concept}</p>
          </div>
        )}

        <div className="blog-header">
          <h2 className="blog-title">{bar.blogTitle}</h2>
          <div className="blog-divider" />
        </div>

        <div className="blog-content">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {bar.signatureDrink && (
          <div className="signature-drink">
            <p className="signature-label">Signature Drink</p>
            <h3 className="signature-name">{bar.signatureDrink}</h3>
            <p className="signature-desc">{bar.signatureDrinkDescription}</p>
          </div>
        )}

        {bar.imagePrompt && (
          <div className="image-prompt-box">
            <div className="prompt-label">
              <span>Nano Banana Bildprompt</span>
              <CopyButton text={bar.imagePrompt} />
            </div>
            <p className="prompt-text">{bar.imagePrompt}</p>
          </div>
        )}

        {(bar.tweet || bar.instagram || bar.facebook) && (
          <div className="social-section">
            <p className="social-heading">Social Media</p>
            <div className="social-grid">
              {bar.tweet && (
                <div className="social-card">
                  <p className="social-platform">X / Twitter</p>
                  <p className="social-text">{bar.tweet}</p>
                </div>
              )}
              {bar.instagram && (
                <div className="social-card">
                  <p className="social-platform">Instagram</p>
                  <p className="social-text">{bar.instagram}</p>
                </div>
              )}
              {bar.facebook && (
                <div className="social-card">
                  <p className="social-platform">Facebook</p>
                  <p className="social-text">{bar.facebook}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="detail-nav">
          {prev ? (
            <Link href={`/bar/${prev.slug}/`} className="detail-nav-link prev">
              <span className="nav-dir">← Vorherige</span>
              <span className="nav-bar-name">{prev.name}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/bar/${next.slug}/`} className="detail-nav-link next">
              <span className="nav-dir">Nächste →</span>
              <span className="nav-bar-name">{next.name}</span>
            </Link>
          ) : <span />}
        </nav>
      </main>

      <footer className="footer">
        © Lieblingsbars — Alle Bars sind fiktiv, alle Drinks erfunden, alle Träume echt.
      </footer>
    </>
  );
}
