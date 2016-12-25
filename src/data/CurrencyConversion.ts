
export default class CurrencyConversion {

  public toCurrencyAmount: number;

  constructor(public fromCurrencySymbol: string, public fromCurrencyLabel: string, public fromCurrencyAmount: number, public toCurrencySymbol: string, public toCurrencyLabel: string, toCurrencyAmount: string) {
    this.fromCurrencySymbol = fromCurrencySymbol;
    this.fromCurrencyLabel = fromCurrencyLabel;
    this.fromCurrencyAmount = fromCurrencyAmount;
    this.toCurrencySymbol = toCurrencySymbol;
    this.toCurrencyLabel = toCurrencyLabel;
    this.toCurrencyAmount = parseFloat(toCurrencyAmount);
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
