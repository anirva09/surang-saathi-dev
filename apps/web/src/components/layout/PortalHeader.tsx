import React from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SurangMark } from "./SurangMark";

export function PortalHeader() {
  return (
    <div className="w-full bg-surface border-b border-border">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <SurangMark className="w-10 h-10 shrink-0" />
            <span className="flex flex-col min-w-0">
              <span className="text-[0.9375rem] leading-[1.6] font-bold text-text">
                सुरंग साथी
              </span>
              <span className="text-[1.125rem] leading-tight font-bold tracking-tight text-primary">
                SURANG SAATHI
              </span>
              <span className="text-[0.75rem] leading-tight text-text/80">
                Smart Mine Safety &amp; Compliance Platform
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ButtonLink href="/login" variant="secondary" size="md">
              <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
              Officer Login
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="primary" size="md">
              <span className="hidden sm:inline">Open Manager Portal</span>
              <span className="sm:hidden">Manager Portal</span>
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
