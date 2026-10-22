import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

// Returns { slug: blobUrl } for all uploaded bar images
export async function GET() {
  try {
    const { blobs } = await list({ prefix: "bars/" });
    const manifest = {};
    for (const blob of blobs) {
      // blob.pathname = "bars/abbaubar.jpg"
      const slug = blob.pathname.replace(/^bars\//, "").replace(/\.[^.]+$/, "");
      if (slug) manifest[slug] = blob.url;
    }
    return NextResponse.json(manifest, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("manifest error:", err);
    return NextResponse.json({});
  }
}
