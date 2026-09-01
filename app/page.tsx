"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/screen/splash");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "#0b0b0d",
        color: "#f5efe6",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "28px", margin: 0 }}>Split the Plate</h1>
      <p style={{ opacity: 0.7, margin: 0 }}>Loading prototype…</p>
      <Link
        href="/screen/splash"
        style={{
          marginTop: "8px",
          padding: "10px 18px",
          borderRadius: "999px",
          background: "#f59e0b",
          color: "#111",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Enter prototype →
      </Link>
    </div>
  );
}
