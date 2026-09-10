import React from "react";
import Link from "next/link";
import { Construction } from "lucide-react";
import { PortalMasthead } from "@/components/layout/PortalMasthead";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Homepage links point at real MVP routes. Until those routes are implemented
 * this page answers honestly instead of showing a bare framework 404 — no link
 * on the portal pretends to lead somewhere finished.
 */
export default function NotFound() {
  return (
    <>
      <PortalMasthead />

      <main id="main-content" tabIndex={-1} className="bg-background">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16">
          <div className="max-w-[70ch] border border-border bg-surface rounded-[2px] p-6 sm:p-8">
            <span
              className="inline-flex items-center justify-center w-11 h-11 rounded-[2px] bg-accent/20 text-warningInk"
              aria-hidden="true"
            >
              <Construction className="w-5 h-5" />
            </span>

            <h1 className="mt-5 text-[1.625rem] font-bold tracking-tight text-text">
              This section is not built yet
            </h1>

            <p className="mt-3 text-[0.9375rem] leading-relaxed text-text/80">
              The current milestone covers the Surang Saathi portal homepage
              and the manager safety dashboard. The hazard register, inspection
              register, corrective actions, compliance and audit ledger screens
              are next on the roadmap and are not implemented in this build.
            </p>

            <p className="mt-3 text-[0.9375rem] leading-relaxed text-text/80">
              The link you followed points at the route this screen will occupy,
              so nothing here is a placeholder button — it simply has not been
              built yet.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/" variant="primary" size="lg">
                Return to the portal homepage
              </ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                Open the safety dashboard
              </ButtonLink>
            </div>

            <p className="mt-6 pt-5 border-t border-border text-[0.8125rem] text-text/80">
              Looking for something specific?{" "}
              <Link
                href="/help"
                className="text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Help &amp; resources
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <PortalFooter />
    </>
  );
}
