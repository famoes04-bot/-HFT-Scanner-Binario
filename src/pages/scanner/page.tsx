import React, { useState } from "react";
import ScannerHeader from "./_components/ScannerHeader";
import ScannerGrid from "./_components/ScannerGrid";
import { useScannerEngine } from "@/hooks/use-scanner-engine";

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [timeframe, setTimeframe] = useState("M1");

  // Motor em tempo real do hook alimentando a interface gráfica
  const { activeSignals, globalWinRate } = useScannerEngine(isScanning, timeframe);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-foreground p-4 md:p-8 font-mono pb-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Componente existente que controla o estado de Ligar/Desligar */}
        <ScannerHeader 
          isScanning={isScanning} 
          onToggleScan={() => setIsScanning(!isScanning)} 
        />

        {/* Bloco Superior de Estatísticas Preditivas e Histórico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111622] border border-border/60 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground">ASSERTIVIDADE GLOBAL (HISTÓRICO)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-green-400">
                {isScanning ? `${globalWinRate}%` : "0%"}
              </span>
              <span className="text-xs text-muted-foreground">Ciclo Recente</span>
            </div>
          </div>

          <div className="bg-[#111622] border border-border/60 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground">PRÓXIMO CICLO PREVISTO (FUTURO)</span>
            <div className="text-xs font-bold text-primary mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              VELA PROJETADA EM {timeframe}
            </div>
          </div>

          <div className="bg-[#111622] border border-border/60 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground">TIMEFRAME SELECIONADO</span>
            <div className="flex gap-2 mt-2">
              {["M1", "M5", "M15"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs px-3 py-1.5 rounded-md border font-bold transition-all ${
                    timeframe === tf
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-[#0d1017] border-border/40 text-muted-foreground"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Monitoramento em Tempo Real */}
        <div>
          <h2 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            MONITOR DE ENTRADAS ATIVAS
          </h2>
          <ScannerGrid signals={activeSignals} />
        </div>

      </div>
    </div>
  );
}
