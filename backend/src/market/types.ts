export interface RawMarketRow {
  state_name: string;
  product: string;
  demand_score: number;
  supply_score: number;
  trend: string;
  shortage_risk: string | string[];
  opportunity: boolean;
  price_per_unit?: number;
  price_trend?: string;
  nearby_suppliers?: number;
  trend_7days?: number[];
  price_history?: number[];
}
