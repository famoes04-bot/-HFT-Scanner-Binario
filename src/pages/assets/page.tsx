import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Layers, TrendingUp } from "lucide-react";
import { ASSETS, type AssetCategory, type AssetType, type Broker } from "@/lib/assets.ts";
import { cn } from "@/lib/utils.ts";

const CATEGORY_LABELS: Record<AssetCategory | "all", string> = {
  all: "Todos",
  forex: "Forex",
  crypto: "Crypto",
  commodity: "Commodity",
  index: "Índices",
};

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  forex: "#00C2D1",
  crypto: "#FFA502",
  commodity: "#05C46B",
  index: "#A855F7",
};

const TYPE_COLORS: Record<AssetType, string> = {
  otc: "#FF4757",
  normal: "#05C46B",
};

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [broker, setBroker] = useState<"all" | Broker>("all");
  const [type, setType] = useState<"all" | AssetType>("all");
  const [category, setCategory] = useState<"all" | AssetCategory>("all");

  const filtered = useMemo(() => {
    return ASSETS.filter((a) => {
      if (broker !== "all" && a.broker !== broker) return false;
      if (type !== "all" && a.type !== type) return false;
      if (category !== "all" && a.category !== category) return false;
      if (search && !a.symbol.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [broker, type, category, search]);

  const totalByBroker = (b: Broker) => ASSETS.filter((a) => a.broker === b).length;
  const totalByType = (t: AssetType) => ASSETS.filter((a) => a.type === t).length;
  const totalByCategory = (c: AssetCategory) => ASSETS.filter((a) => a.category === c).length;

  const selectClass =
    "bg-[#111620] text-foreground border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer";

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <header className="border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <Layers size={16} className="text-primary" />
          <span className="font-mono font-bold text-sm text-primary tracking-widest">ATIVOS</span>
          <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
            {ASSETS.length} disponíveis
          </span>
        </div>
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors border border-border rounded px-2.5 py-1.5 bg-[#111620] cursor-pointer"
        >
          <TrendingUp size={13} />
          Scanner
        </Link>
      </header>

      <div className="px-4 pt-4 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["forex", "crypto", "commodity", "index"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? "all" : cat)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left cursor-pointer transition-all",
              category === cat ? "border-current bg-current/10" : "border-border bg-[#111620] hover:border-current/40",
            )}
            style={{ color: CATEGORY_COLORS[cat] }}
          >
            <p className="text-[10px] font-mono opacity-70 uppercase tracking-wider">
              {CATEGORY_LABELS[cat]}
            </p>
            <p className="font-mono font-bold text-lg">{totalByCategory(cat)}</p>
          </button>
        ))}
      </div>

      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 bg-[#111620] border border-border rounded px-3 py-1.5 flex-1 max-w-xs">
          <Search size={13} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Buscar ativo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>

        <select value={broker} onChange={(e) => setBroker(e.target.value as "all" | Broker)} className={selectClass}>
          <option value="all">Todos Brokers ({ASSETS.length})</option>
          <option value="Pocket">Pocket ({totalByBroker("Pocket")})</option>
          <option value="IQCent">IQCent ({totalByBroker("IQCent")})</option>
        </select>

        <select value={type} onChange={(e) => setType(e.target.value as "all" | AssetType)} className={selectClass}>
          <option value="all">Todos Tipos</option>
          <option value="normal">Mercado ({totalByType("normal")})</option>
          <option value="otc">OTC ({totalByType("otc")})</option>
        </select>

        <span className="text-[11px] font-mono text-muted-foreground ml-auto">
          <span className="text-foreground font-semibold">{filtered.length}</span> resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="hidden sm:grid grid-cols-[1fr_120px_80px_100px] gap-4 px-4 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider border-b border-border bg-[#0d1019]">
          <span>Ativo</span>
          <span>Broker</span>
          <span>Tipo</span>
          <span>Categoria</span>
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center font-mono text-muted-foreground text-sm">
              Nenhum ativo encontrado
            </div>
          ) : (
            filtered.map((asset) => (
              <div
                key={asset.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_100px] gap-1 sm:gap-4 px-4 py-2.5 hover:bg-white/[0.02] transition-colors items-center"
              >
                <span className="font-mono font-semibold text-xs text-foreground">{asset.symbol}</span>
                <span className="text-[11px] font-mono text-muted-foreground hidden sm:block">{asset.broker}</span>
                <span className="text-[10px] font-mono font-semibold uppercase hidden sm:block" style={{ color: TYPE_COLORS[asset.type] }}>
                  {asset.type === "otc" ? "OTC" : "Mercado"}
                </span>
                <span className="text-[10px] font-mono font-semibold hidden sm:block" style={{ color: CATEGORY_COLORS[asset.category] }}>
                  {CATEGORY_LABELS[asset.category]}
                </span>

                <div className="flex items-center gap-2 sm:hidden">
                  <span className="text-[10px] font-mono text-muted-foreground">{asset.broker}</span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: TYPE_COLORS[asset.type] }}>
                    {asset.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: CATEGORY_COLORS[asset.category] }}>
                    {CATEGORY_LABELS[asset.category]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
