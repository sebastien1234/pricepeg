
export default class CurrencyConversion {
  constructor(public fromCurrencySymbol, public fromCurrencyLabel, public fromCurrencyAmount, public toCurrencySymbol, public toCurrencyLabel, public toCurrencyAmount) {
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
