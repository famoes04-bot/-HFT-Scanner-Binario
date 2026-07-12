export type AssetCategory = "forex" | "crypto" | "commodity" | "index";
export type AssetType = "otc" | "normal";
export type Broker = "Pocket" | "IQCent";

export interface Asset {
  id: string;
  symbol: string;
  broker: Broker;
  type: AssetType;
  category: AssetCategory;
}

export const ASSETS: Asset[] = [
  {"id": "AEDCNY_OTC", "symbol": "AED/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "AUDCAD_OTC", "symbol": "AUD/CAD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "AUDCHF_OTC", "symbol": "AUD/CHF OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "AUDNZD_OTC", "symbol": "AUD/NZD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "AUDUSD_OTC", "symbol": "AUD/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "BHDCNY_OTC", "symbol": "BHD/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "CHFNOK_OTC", "symbol": "CHF/NOK OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "EURHUF_OTC", "symbol": "EUR/HUF OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "EURJPY_OTC", "symbol": "EUR/JPY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "EURNZD_OTC", "symbol": "EURNZD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "JODCNY_OTC", "symbol": "JOD/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "LBPUSD_OTC", "symbol": "LBP/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "MADUSD_OTC", "symbol": "MAD/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "OMRCNY_OTC", "symbol": "OMR/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "SARCNY_OTC", "symbol": "SAR/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDIDR_OTC", "symbol": "USD/IDR OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDPHP_OTC", "symbol": "USD/PHP OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDPKR_OTC", "symbol": "USD/PKR OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "YERUSD_OTC", "symbol": "YER/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "ZARUSD_OTC", "symbol": "ZAR/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDCHF_OTC", "symbol": "USD/CHF OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDTHB_OTC", "symbol": "USD/THB OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "EURGBP_OTC", "symbol": "EUR/GBP OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "EURRUB_OTC", "symbol": "EUR/RUB OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "QARCNY_OTC", "symbol": "QAR/CNY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "USDCLP_OTC", "symbol": "USD/CLP OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "CHFJPY_OTC", "symbol": "CHF/JPY OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "KESUSD_OTC", "symbol": "KES/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "NZDUSD_OTC", "symbol": "NZD/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "TNDUSD_OTC", "symbol": "TND/USD OTC", "broker": "Pocket", "type": "otc", "category": "forex"},
  {"id": "GBPJPY_OTC", "symbol": "GBP/JPY OTC", "broker": "Pocket", "type": "otc", "category": "forex"}
];
