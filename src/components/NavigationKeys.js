"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavigationKeys({ prevSlug, nextSlug }) {
  const router = useRouter();
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowLeft" && prevSlug) router.push(`/bar/${prevSlug}/`);
      if (e.key === "ArrowRight" && nextSlug) router.push(`/bar/${nextSlug}/`);
      if (e.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevSlug, nextSlug, router]);
  return null;
}
