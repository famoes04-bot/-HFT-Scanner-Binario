import { Activity, Volume2, VolumeX, Play, Square, RefreshCw, History } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { useMarketSessions } from "@/hooks/use-market-sessions.ts";

const TIMEFRAMES = ["5s", "10s", "15s", "30s", "M1", "M2", "M3", "M5", "M15", "M30", "H1", "H4"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

type Props = {
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  broker: string;
  setBroker: (b: string) => void;
  assetType: string;
  setAssetType: (t: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  isScanning: boolean;
  setIsScanning: (v: boolean) => void;
  isLoading: boolean;
  signalCount: number;
  onManualScan: () => void;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function UtcClock({ now }: { now: Date }) {
  const h = pad(now.getUTCHours());
  const m = pad(now.getUTCMinutes());
  const s = pad(now.getUTCSeconds());
  return (
    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
      <span className="text-foreground">{h}:{m}</span>
      <span className="opacity-50">:{s}</span>
      <span className="ml-1 text-[9px] opacity-40">UTC</span>
    </span>
  );
}

export default function ScannerHeader({
  timeframe,
  setTimeframe,
  broker,
  setBroker,
  assetType,
  setAssetType,
  soundEnabled,
  setSoundEnabled,
  isScanning,
  setIsScanning,
  isLoading,
  signalCount,
  onManualScan,
}: Props) {
  const { now, sessions } = useMarketSessions();

  const selectClass =
    "bg-[#111620] text-foreground border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer";

  return (
    <header className="border-b border-border px-4 py-2.5 flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <Activity size={16} className="text-primary" />
          <span className="font-mono font-bold text-sm text-primary tracking-widest">TRENDSCANNER</span>
          <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">QUANT</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <UtcClock now={now} />
          <div className="flex items-center gap-1.5">
            {sessions.map((s) => (
              <span
                key={s.id}
                title={s.isOpen ? `${s.label} aberto` : `${s.label} fechado`}
                className={cn(
                  "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border transition-all",
                  s.isOpen
                    ? "bg-green-500/10 border-green-500/40 text-green-400"
                    : "bg-transparent border-border/40 text-muted-foreground/40",
                )}
              >
                {s.id === "new_york" ? "NY" : s.id === "sydney" ? "SY" : s.id === "tokyo" ? "TK" : "LN"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-[11px] font-mono text-muted-foreground">
            <span className="text-foreground font-semibold">{signalCount}</span> sinais
          </div>
          <Link
            to="/history"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border rounded px-2.5 py-1.5 bg-[#111620]"
          >
            <History size={13} />
            Histórico
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as Timeframe)} className={selectClass}>
          {TIMEFRAMES.map((tf) => (
            <option key={tf} value={tf}>{tf}</option>
          ))}
        </select>

        <select value={broker} onChange={(e) => setBroker(e.target.value)} className={selectClass}>
          <option value="all">Todos Brokers</option>
          <option value="Pocket">Pocket</option>
          <option value="IQCent">IQCent</option>
        </select>

        <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className={selectClass}>
          <option value="all">Todos Tipos</option>
          <option value="normal">Mercado</option>
          <option value="otc">OTC</option>
        </select>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded border border-border bg-[#111620] cursor-pointer"
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          {soundEnabled ? <Volume2 size={14} className="text-green-400" /> : <VolumeX size={14} className="text-muted-foreground" />}
        </button>

        <button
          onClick={onManualScan}
          disabled={isLoading}
          className="p-1.5 rounded border border-border bg-[#111620] cursor-pointer disabled:opacity-50"
          title="Scan agora"
        >
          <RefreshCw size={14} className={cn("text-primary", isLoading && "animate-spin")} />
        </button>

        <div className="relative">
          {isScanning && (
            <span className="absolute inset-0 rounded animate-ping bg-destructive/40 pointer-events-none" />
          )}
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold cursor-pointer border-0 transition-colors",
              isScanning ? "bg-destructive text-white" : "bg-primary text-primary-foreground",
            )}
          >
            {isScanning ? <Square size={11} /> : <Play size={11} />}
            {isScanning ? "PARAR" : "INICIAR"}
          </button>
        </div>
      </div>
    </header>
  );
}
