import {LogLevel} from "./config";
import {CurrencyConversionType} from "./data/CurrencyConversion";
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

export interface PegConfig {
  currencies: CurrencyConfig[];
  maxUpdatesPerPeriod: number; // maximum number of peg updates that will be allowed to occur in a single period
  updatePeriod: number; //defintion of the duration of a single period in seconds
  updateThresholdPercentage: number; //percentage at which an update is attempted, if value of peg fluctuates +/- this range
  updateInterval: number; //time in second to check for price change updates
  enableLivePegUpdates: boolean; //debug mode, disables live updates to peg on network
  enablePegUpdateDebug: boolean; //debug mode, enables debug mode which updates peg on set interval w fixed update rather than market rates
  debugPegUpdateInterval: number; //debug mode, how frequently to update peg
  debugPegUpdateIncrement: number; //debug mode, how much to increment USD conversion
  rpcserver: string;
  rpcuser: string;
  rpcpassword: string;
  rpcport: number;
  rpctimeout: number;
  pegalias: string;
  pegalias_aliaspeg: string;
  httpport: number;
  logLevel: LogLevel;
  debugLogFilename: string;
  updateLogFilename: string;
  version: string;
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

//holds mock peg data for sync testing
export const mockPeg: PricePegModel = {
  "rates": [
    {"currency": "USD", "rate": 0.5, "escrowfee": 0.005, "precision": 2},
    {"currency": "EUR", "rate": 2695.2, "escrowfee": 0.005, "precision": 2},
    {"currency": "GBP", "rate": 2697.3, "escrowfee": 0.005, "precision": 2},
    {"currency": "CAD", "rate": 2698.0, "escrowfee": 0.005, "precision": 2},
    {"currency": "BTC", "rate": 100000.0, "fee": 75, "escrowfee": 0.01, "precision": 8},
    {"currency": "ZEC", "rate": 10000.0, "fee": 50, "escrowfee": 0.01, "precision": 8},
    {"currency": "SYS", "rate": 1.0, "fee": 1000, "escrowfee": 0.005, "precision": 2}
  ]
};

export const supportedCurrencies: CurrencyData[] = [
  /* FIAT CURRENCIES */
  CurrencyConversionType.FIAT.USD,
  CurrencyConversionType.FIAT.GBP,
  CurrencyConversionType.FIAT.CNY,
  CurrencyConversionType.FIAT.EUR,
  CurrencyConversionType.FIAT.CAD,
  CurrencyConversionType.FIAT.AUD,
  CurrencyConversionType.FIAT.BGN,
  CurrencyConversionType.FIAT.BRL,
  CurrencyConversionType.FIAT.CHF,
  CurrencyConversionType.FIAT.CZK,
  CurrencyConversionType.FIAT.DKK,
  CurrencyConversionType.FIAT.HKD,
  CurrencyConversionType.FIAT.HRK,
  CurrencyConversionType.FIAT.HUF,
  CurrencyConversionType.FIAT.IDR,
  CurrencyConversionType.FIAT.ILS,
  CurrencyConversionType.FIAT.INR,
  CurrencyConversionType.FIAT.JPY,
  CurrencyConversionType.FIAT.KRW,
  CurrencyConversionType.FIAT.MXN,
  CurrencyConversionType.FIAT.MYR,
  CurrencyConversionType.FIAT.NOK,
  CurrencyConversionType.FIAT.NZD,
  CurrencyConversionType.FIAT.PHP,
  CurrencyConversionType.FIAT.PLN,
  CurrencyConversionType.FIAT.RON,
  CurrencyConversionType.FIAT.RUB,
  CurrencyConversionType.FIAT.SEK,
  CurrencyConversionType.FIAT.SGD,
  CurrencyConversionType.FIAT.THB,
  CurrencyConversionType.FIAT.TRY,
  CurrencyConversionType.FIAT.ZAR,

  /* BLOCKCHAIN CURRENCIES */
  CurrencyConversionType.CRYPTO.BTC,
  CurrencyConversionType.CRYPTO.SYS,
  CurrencyConversionType.CRYPTO.ZEC,
  CurrencyConversionType.CRYPTO.ETH,
  CurrencyConversionType.CRYPTO.DASH,
  CurrencyConversionType.CRYPTO.XMR,
  CurrencyConversionType.CRYPTO.FCT,
  CurrencyConversionType.CRYPTO.WAVES
];