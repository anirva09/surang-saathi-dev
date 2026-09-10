import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surang Saathi — Smart Mine Safety & Compliance Platform",
  description:
    "Surang Saathi is an SIH 2026 prototype portal for coal-mine safety, inspection evidence, corrective-action accountability and auditable compliance. Not an official Government of India service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
