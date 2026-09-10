import React from "react";
import { GovUtilityBar } from "./GovUtilityBar";
import { PrototypeNotice } from "./PrototypeNotice";
import { PortalHeader } from "./PortalHeader";
import { PrimaryNav } from "./PrimaryNav";

/**
 * The full portal masthead as one `banner` landmark.
 *
 * The utility strip, prototype notice, identity block and primary navigation
 * are all site-wide banner content, so they belong inside a single <header>.
 * Keeping them here means no page content sits outside a landmark.
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
