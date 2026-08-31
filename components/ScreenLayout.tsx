"use client";

import Sidebar from "./Sidebar";
import PhoneFrame from "./PhoneFrame";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPrevScreen, getNextScreen } from "@/lib/screens";
import ScreenContent from "./ScreenContent";

export default function ScreenLayout({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const prev = getPrevScreen(slug);
        if (prev) router.push(`/screen/${prev.slug}`);
      }
      if (e.key === "ArrowRight") {
        const next = getNextScreen(slug);
        if (next) router.push(`/screen/${next.slug}`);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slug, router]);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--bg-deep)",
    }}>
      <Sidebar currentSlug={slug} />
      <PhoneFrame slug={slug}>
        <ScreenContent slug={slug} />
      </PhoneFrame>
    </div>
  );
}
