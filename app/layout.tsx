import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Split the Plate — Prototype",
  description: "The social bill-split app. Phase 0 clickable prototype.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
