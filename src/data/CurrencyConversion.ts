
export default class CurrencyConversion {
  constructor(public fromCurrencySymbol: string, public fromCurrencyLabel: string, public fromCurrencyAmount: number, public toCurrencySymbol: string, public toCurrencyLabel: string, public toCurrencyAmount: number) {
    this.fromCurrencySymbol = fromCurrencySymbol;
    this.fromCurrencyLabel = fromCurrencyLabel;
    this.fromCurrencyAmount = fromCurrencyAmount;
    this.toCurrencySymbol = toCurrencySymbol;
    this.toCurrencyLabel = toCurrencyLabel;
    this.toCurrencyAmount = toCurrencyAmount;
  }
}

export const CurrencyConversionType = {
  FIAT: {
    USD: "USD",
    GBP: "GBP",
    CNY: "CNY",
    EUR: "EUR",
    CAD: "CAD"
  },
  CRYPTO: {
    BTC: "BTC",
    SYS: "SYS",
    ZEC: "ZEC"
  }
};
