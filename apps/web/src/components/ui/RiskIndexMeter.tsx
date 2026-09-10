import React from "react";
import { cn } from "@/utils/cn";

export interface ContributingFactor {
  name: string;
  weight: number;
  currentValue: string | number;
}

export interface RiskIndexMeterProps {
  score: number;
  contributingFactors: ContributingFactor[]; // Required by contract
  className?: string;
}

export function RiskIndexMeter({ score, contributingFactors, className }: RiskIndexMeterProps) {
  // Determine risk band
  let riskBand = "Low Risk";
  let colorClass = "text-success bg-success/10 border-success/20";
  let barColor = "bg-success";
  
  if (score >= 40 && score < 70) {
    riskBand = "Medium Risk";
    colorClass = "text-warningInk bg-accent/10 border-accent/20";
    barColor = "bg-accent";
  } else if (score >= 70) {
    riskBand = "High Risk";
    colorClass = "text-dangerInk bg-danger/10 border-danger/20";
    barColor = "bg-danger";
  }

  return (
    <div className={cn("flex flex-col border border-border bg-surface rounded-[2px] overflow-hidden", className)}>
      <div className={cn("p-4 border-b flex items-center justify-between", colorClass)}>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold">Mine Risk Index (MRI)</span>
          <span className="text-[12px] font-medium">{riskBand}</span>
        </div>
        <div className="text-2xl font-bold">{score.toFixed(1)}</div>
      </div>
      
      <div className="p-4 bg-background">
        <div className="text-[12px] font-bold text-text uppercase tracking-wider mb-3">Contributing Factors</div>
        <div className="flex flex-col gap-3">
          {contributingFactors.map((factor, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-medium text-text">{factor.name}</span>
                <span className="text-text/80">{factor.currentValue} · {Math.round(factor.weight * 100)}% weight</span>
              </div>
              <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", barColor)} 
                  style={{ width: `${Math.min(100, Math.max(0, factor.weight * 100))}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


