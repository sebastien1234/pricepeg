export interface PricePegModel {
  rates: PricePegEntry[];
}

export interface PricePegEntry {
  currency: string;
  rate: number; // how many SYS equal 1 of this currency
  fee?: number; // fee per byte on transactions in satoshis, defaults to 25
  escrowfee?: number; // escrow fee % for arbiters on offers that use this peg, defaults to 0.005 (0.05%)
  precision: number; // int
}

export type HistoryLog = HistoryLogEntry[];

export interface HistoryLogEntry {
  date: number; //result of Date.now()
  value: PricePegModel;
}

export interface CurrencyConfig {
  currencySymbol: string;
  isFiat: boolean;
  dataSources?: string;
  escrowFee?: number;
  fee?: number;
  precision?: number;
}

export interface CurrencyData {
  symbol: string;
  label: string;
}