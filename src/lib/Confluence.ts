export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SignalResult {
  hasSignal: boolean;
  direction: "CALL" | "PUT" | null;
  score: number;
  details: any;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCandles(assetId: string, isOtc: boolean, count: number, seed: number): Candle[] {
  const rand = mulberry32(seed);
  const basePrices: Record<string, number> = {
    EURUSD: 1.09, GBPUSD: 1.27, USDJPY: 150.0, AUDUSD: 0.66,
    BTCUSDT: 60000, ETHUSDT: 3000, BNBUSDT: 600, XAUUSD: 2000,
    BRENT: 80, WTI: 75, SILVER: 25, GOLD: 2000,
  };
  
  const prefix = assetId.split("_")[0];
  const basePrice = basePrices[prefix] ?? 1.0;

  const isCrypto = ["BTC", "ETH", "BNB", "DOGE", "SOL", "XRP", "QNT", "ETC"].some((t) => assetId.includes(t));
  const isIndex = assetId.includes("IDX");
  
  let vol = isOtc ? 0.0012 : 0.0007;
  if (isCrypto) vol = isOtc ? 0.015 : 0.008;
  if (isIndex) vol = isOtc ? 0.005 : 0.002;

  const candles: Candle[] = [];
  let price = basePrice;
  let trend = (rand() - 0.5) * 0.0002;

  for (let i = 0; i < count; i++) {
    if (i % 30 === 0) trend = (rand() - 0.5) * 0.0004;
    const change = (rand() - 0.5) * vol + trend;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + rand() * vol * 0.5;
    const low = Math.min(open, close) - rand() * vol * 0.5;
    
    candles.push({
      open: +open.toFixed(6),
      high: +high.toFixed(6),
      low: +low.toFixed(6),
      close: +close.toFixed(6),
    });
    price = close;
  }
  return candles;
}

function ema(data: number[], period: number): number[] {
  const alpha = 2 / (period + 1);
  const result: number[] = new Array(data.length).fill(NaN);
  result[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    result[i] = alpha * data[i] + (1 - alpha) * result[i - 1];
  }
  return result;
}

function sma200(data: number[]): number {
  if (data.length < 200) return NaN;
  return data.slice(-200).reduce((a, b) => a + b, 0) / 200;
}

function computeSupertrend(candles: Candle[], period: number): 1 | -1 | 0 {
  if (candles.length < period) return 0;
  // Simplificação matemática do Supertrend para retorno de direção funcional (1 para CALL, -1 para PUT)
  const lastCandle = candles[candles.length - 1];
  return lastCandle.close > lastCandle.open ? 1 : -1;
}

function computeZigZag(candles: Candle[], depth: number): "TOP" | "BOTTOM" | "NEUTRAL" {
  const n = candles.length;
  if (n < depth + 2) return "NEUTRAL";
  const idx = n - 1;
  const isTop = Array.from({ length: Math.min(depth, idx) }, (_, k) => k + 1).every(
    (k) => candles[idx].high > candles[idx - k].high,
  );
  const isBottom = Array.from({ length: Math.min(depth, idx) }, (_, k) => k + 1).every(
    (k) => candles[idx].low < candles[idx - k].low,
  );
  if (isTop) return "TOP";
  if (isBottom) return "BOTTOM";
  return "NEUTRAL";
}

function computeMacdOsma(close: number[]): { macdAboveSignal: boolean; osmaPositive: boolean } {
  const fast = ema(close, 12);
  const slow = ema(close, 26);
  const macd = fast.map((v, i) => v - slow[i]);
  const signal = ema(macd, 9);
  const osma = macd.map((v, i) => v - signal[i]);
  const last = close.length - 1;
  return {
    macdAboveSignal: macd[last] > signal[last],
    osmaPositive: osma[last] > 0,
  };
}

export function checkConfluence(candles: Candle[]): SignalResult {
  if (candles.length < 200) {
    return { hasSignal: false, direction: null, score: 0, details: null };
  }

  const close = candles.map((c) => c.close);
  const stFast = computeSupertrend(candles, 10);
  const stSlow = computeSupertrend(candles, 26);
  const zzFast = computeZigZag(candles, 12);
  const zzSlow = computeZigZag(candles, 26);

  const ema10arr = ema(close, 10);
  const ema26arr = ema(close, 26);
  const last = candles.length - 1;
  const emaCross = ema10arr[last] > ema26arr[last];
  const priceAboveSma = close[last] > sma200(close);

  const { macdAboveSignal, osmaPositive } = computeMacdOsma(close);

  // Cálculo de pontuação de confluência (0 a 9 baseado nas condições de mercado)
  let score = 0;
  if (stFast === 1) score++;
  if (stSlow === 1) score++;
  if (zzFast === "TOP" || zzFast === "NEUTRAL") score++;
  if (zzSlow === "TOP" || zzSlow === "NEUTRAL") score++;
  if (emaCross) score++;
  if (priceAboveSma) score++;
  if (macdAboveSignal) score++;
  if (osmaPositive) score++;

  const targetDir = stSlow === 1 ? "CALL" : "PUT";

  return {
    hasSignal: score >= 7,
    direction: targetDir,
    score,
    details: { emaCross, priceAboveSma, macdAboveSignal, osmaPositive }
  };
}
