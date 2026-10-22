import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const PASSWORD = process.env.REDAKTION_PASSWORD || "lieblingsbars";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const password = formData.get("password");
    const slug = formData.get("slug");
    const file = formData.get("file");

    if (password !== PASSWORD) {
      return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
    }
    if (!slug || !file) {
      return NextResponse.json({ error: "slug und file required" }, { status: 400 });
    }

    const blob = await put(`bars/${slug}.jpg`, file, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, slug });
  } catch (err) {
    console.error("upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
