import React from "react";
import { KpiCard } from "./KpiCard";
import { DASHBOARD_KPIS } from "@/data/demo/dashboard";

export function KpiGrid() {
  return (
    <section aria-labelledby="kpi-heading" className="min-w-0">
      <h2 id="kpi-heading" className="sr-only">
        Priority indicators for this shift
      </h2>

      {/* 1-up below 480px so labels never cramp, 2×2 on tablet, 4-up on
          desktop — the row must stay scannable, not merely fit. */}
      <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-3">
        {DASHBOARD_KPIS.map((kpi) => (
          <li key={kpi.id} className="min-w-0">
            <KpiCard kpi={kpi} />
          </li>
        ))}
      </ul>
    </section>
  );
}
