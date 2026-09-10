import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { LocaleFontSync } from "@/i18n/LocaleClass";

export const metadata: Metadata = {
  title: "Surang Saathi — Smart Mine Safety & Compliance Platform",
  description:
    "Surang Saathi is an SIH 2026 prototype platform for coal-mine safety: offline field capture, server-verified evidence, accountable corrective actions and an auditable compliance record. Not an official Government of India service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang starts at "en" — the default locale — and LanguageProvider updates
  // document.documentElement.lang when the user selects another language.
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <LanguageProvider>
          <LocaleFontSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
