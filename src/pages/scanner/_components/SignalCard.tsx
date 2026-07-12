import React from "react";
import { ArrowUpRight, ArrowDownRight, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  assetId: string;
  symbol: string;
  direction: "CALL" | "PUT";
  score: number;
  winRate: number;
  isOtc: boolean;
  details: {
    emaCross: boolean;
    priceAboveSma: boolean;
    macdAboveSignal: boolean;
    osmaPositive: boolean;
    stFast: number;
    stSlow: number;
    zzFast: string;
    zzSlow: string;
  };
}

export default function SignalCard({ symbol, direction, score, winRate, isOtc, details }: SignalCardProps) {
  const isCall = direction === "CALL";
  
  const indicatorsList = [
    { label: "STf", active: details.stFast === (isCall ? 1 : -1) },
    { label: "STs", active: details.stSlow === (isCall ? 1 : -1) },
    { label: "ZZf", active: isCall ? (details.zzFast === "BOTTOM" || details.zzFast === "NEUTRAL") : (details.zzFast === "TOP" || details.zzFast === "NEUTRAL") },
    { label: "ZZs", active: isCall ? (details.zzSlow === "BOTTOM" || details.zzSlow === "NEUTRAL") : (details.zzSlow === "TOP" || details.zzSlow === "NEUTRAL") },
    { label: "EMA", active: isCall ? details.emaCross : !details.emaCross },
    { label: "SMA", active: isCall ? details.priceAboveSma : !details.priceAboveSma },
    { label: "MACD", active: isCall ? details.macdAboveSignal : !details.macdAboveSignal },
    { label: "OsMA", active: isCall ? details.osmaPositive : !details.osmaPositive },
    { label: "Fluxo", active: score >= 8 }
  ];

  return (
    <div className="bg-[#111622] border border-border/80 rounded-xl p-4 flex flex-col gap-3 hover:border-primary/40 transition-all font-mono">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            {symbol}
            {isOtc && <span className="text-[9px] bg-destructive/10 border border-destructive/30 text-destructive px-1 rounded">OTC</span>}
          </h3>
          <span className="text-[10px] text-muted-foreground">Expiração: 3min</span>
        </div>
        <span className={cn("text-xs font-bold", winRate >= 85 ? "text-green-400" : "text-amber-400")}>
          {winRate}% WR
        </span>
      </div>

      <div className={cn(
        "py-2.5 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2 border",
        isCall 
          ? "bg-green-500/10 border-green-500/30 text-green-400" 
          : "bg-red-500/10 border-red-500/30 text-red-400"
      )}>
        {isCall ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {direction}
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-2">
        <span className="text-xs font-bold text-foreground">{score}/9 Confluência</span>
        {score >= 8 && (
          <span className="text-[9px] font-bold bg-amber-500/10 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert size={10} /> REGRA DE OURO
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-[#0d1017] p-2 rounded-lg border border-border/20 text-[9px] text-center">
        {indicatorsList.map((ind, idx) => (
          <div key={idx} className="flex flex-col items-center gap-0.5">
            <span className="text-muted-foreground font-light text-[8px]">{ind.label}</span>
            <span className={cn("w-2 h-2 rounded-full", ind.active ? "bg-green-500 shadow-[0_0_6px_#22c55e]" : "bg-red-500")} />
          </div>
        ))}
      </div>
    </div>
  );
}
