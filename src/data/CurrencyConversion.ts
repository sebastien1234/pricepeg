
export default class CurrencyConversion {

  public toCurrencyAmount: number;

  constructor(public fromCurrencySymbol: string, public fromCurrencyLabel: string, public fromCurrencyAmount: number, public toCurrencySymbol: string, public toCurrencyLabel: string, toCurrencyAmount: number) {
    this.fromCurrencySymbol = fromCurrencySymbol;
    this.fromCurrencyLabel = fromCurrencyLabel;
    this.fromCurrencyAmount = parseFloat(fromCurrencyAmount.toString()); // force to number type
    this.toCurrencySymbol = toCurrencySymbol;
    this.toCurrencyLabel = toCurrencyLabel;
    this.toCurrencyAmount = parseFloat(toCurrencyAmount.toString()); //force to number type
  }
}

export const CurrencyConversionType = {
  FIAT: {
    USD: {
      symbol: "USD",
      label: "US Dollar"
    },
    GBP: {
      symbol: "GBP",
      label: "British Pound",
    },
    CNY: {
      symbol: "CNY",
      label: "Chinese Yuan"
    },
    EUR: {
      symbol: "EUR",
      label: "Euro"
    },
    CAD: {
      symbol: "CAD",
      label: "Canada"
    }
  },
  CRYPTO: {
    BTC: {
      symbol: "BTC",
      label: "Bitcoin"
    },
    SYS: {
      symbol: "SYS",
      label: "Syscoin"
    },
    ZEC: {
      symbol: "ZEC",
      label: "ZCash"
    },
    FCT: {
      symbol: "FCT",
      label: "Factom"
    }
  }
};
