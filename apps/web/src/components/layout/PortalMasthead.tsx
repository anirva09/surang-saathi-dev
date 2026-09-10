import React from "react";
import { GovUtilityBar } from "./GovUtilityBar";
import { PrototypeNotice } from "./PrototypeNotice";
import { PortalHeader } from "./PortalHeader";
import { PrimaryNav } from "./PrimaryNav";

/**
 * Officer-portal masthead, used by /dashboard.
 *
 * The public outreach site uses SiteHeader instead. Both are one `banner`
 * landmark and share the utility strip and prototype notice. Session 2 re-skins
 * this to the locked Golden Master system.
 */
export function PortalMasthead() {
  return (
    <header>
      <GovUtilityBar />
      <PrototypeNotice />
      <PortalHeader />
      <PrimaryNav />
    </header>
  );
}
