import React from "react";
import SignalCard from "./SignalCard";

interface ScannerGridProps {
  signals: any[];
}

export default function ScannerGrid({ signals }: ScannerGridProps) {
  if (signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/40 rounded-xl bg-[#0d1017]/50 font-mono text-xs text-muted-foreground p-6 text-center">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mb-2" />
        AGUARDANDO CONFLUÊNCIA MÍNIMA EM TEMPO REAL...
        <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-xs">
          O sistema está varrendo os indicadores em segundo plano procurando por confluências ≥ 7/9.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {signals.map((signal) => (
        <SignalCard
          key={signal.id}
          assetId={signal.id}
          symbol={signal.symbol}
          direction={signal.direction}
          score={signal.score}
          winRate={signal.winRate}
          isOtc={signal.type === "otc"}
          details={signal.details}
        />
      ))}
    </div>
  );
}
