import { screens } from "@/lib/screens";
import ScreenLayout from "@/components/ScreenLayout";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return screens.map((s) => ({ slug: s.slug }));
}

export default async function ScreenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const screen = screens.find((s) => s.slug === slug);
  if (!screen) notFound();
  return <ScreenLayout slug={slug} />;
}
