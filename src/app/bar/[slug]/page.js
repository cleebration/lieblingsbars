import Link from "next/link";
import { notFound } from "next/navigation";
import barsData from "../../../../data/bars.json";
import CopyButton from "../../../components/CopyButton";
import { getBarImageUrl, LOCAL_IMAGES } from "../../../lib/bar-images";
import NavigationKeys from "../../../components/NavigationKeys";

export const revalidate = 60;
export const dynamicParams = true;

async function getManifest() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lieblingsbars.cleebration.com";
    const res = await fetch(`${base}/api/manifest`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  return barsData.filter((b) => LOCAL_IMAGES.has(b.slug)).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const bar = barsData.find((b) => b.slug === params.slug);
  if (!bar) return {};
  return {
    title: `${bar.name} — Lieblingsbars`,
    description: bar.tagline,
  };
}

export default async function BarPage({ params }) {
  const manifest = await getManifest();

  // Only show bars that have some kind of image (local or blob)
  const barsWithImages = barsData.filter(
    (b) => getBarImageUrl(b) || manifest[b.slug]
  );

  const idx = barsWithImages.findIndex((b) => b.slug === params.slug);
  if (idx === -1) notFound();

  const bar = barsWithImages[idx];
  const prev = idx > 0 ? barsWithImages[idx - 1] : null;
  const next = idx < barsWithImages.length - 1 ? barsWithImages[idx + 1] : null;

  const imageUrl = getBarImageUrl(bar) || manifest[bar.slug] || null;

  const paragraphs = bar.blogContent
    ? bar.blogContent.split(/\n\n+/).filter(Boolean)
    : [];

  return (
    <>
      <NavigationKeys prevSlug={prev?.slug} nextSlug={next?.slug} />

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">← Lieblingsbars</Link>
          <span className="nav-count">{idx + 1} / {barsWithImages.length}</span>
        </div>
      </nav>

      {imageUrl && (
        <div className="detail-hero-wrap">
          {prev && (
            <Link href={`/bar/${prev.slug}/`} className="hero-nav hero-nav-prev" aria-label="Vorherige Bar">
              ‹
            </Link>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="detail-hero-img"
            src={imageUrl}
            alt={bar.name}
            width={1200}
            height={600}
          />
          {next && (
            <Link href={`/bar/${next.slug}/`} className="hero-nav hero-nav-next" aria-label="Nächste Bar">
              ›
            </Link>
          )}
        </div>
      )}

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
