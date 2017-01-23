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
    USD: {symbol: "USD", label: "US Dollar"},
    GBP: {symbol: "GBP", label: "British Pound"},
    CNY: {symbol: "CNY", label: "Chinese Yuan"},
    EUR: {symbol: "EUR", label: "Euro"},
    CAD: {symbol: "CAD", label: "Canada"},
    AUD: {symbol: "AUD", label: "Australian Dollar"},
    BGN: {symbol: "BGN", label: "Bulgarian Lev"},
    BRL: {symbol: "BRL", label: "Brazilian Real"},
    CHF: {symbol: "CHF", label: "Swiss Franc"},
    CZK: {symbol: "CZK", label: "Czech Republic Koruna"},
    DKK: {symbol: "DKK", label: "Danish Krone"},
    HKD: {symbol: "HKD", label: "Hong Kong Dollar"},
    HRK: {symbol: "HRK", label: "Croatian Kuna"},
    HUF: {symbol: "HUF", label: "Hungarian Forint"},
    IDR: {symbol: "IDR", label: "Indonesian Rupiah"},
    ILS: {symbol: "ILS", label: "Israeli New Shekel"},
    INR: {symbol: "INR", label: "Indian Rupee"},
    JPY: {symbol: "JPY", label: "Japanese Yen"},
    KRW: {symbol: "KRW", label: "South Korean Won"},
    MXN: {symbol: "MXN", label: "Mexican Peso"},
    MYR: {symbol: "MYR", label: "Malaysian Ringgit"},
    NOK: {symbol: "NOK", label: "Norwegian Krone"},
    NZD: {symbol: "NZD", label: "New Zealand Dollar"},
    PHP: {symbol: "PHP", label: "Philippine Peso"},
    PLN: {symbol: "PLN", label: "Polish Zloty"},
    RON: {symbol: "RON", label: "Romanian Leu"},
    RUB: {symbol: "RUB", label: "Russian Ruble"},
    SEK: {symbol: "SEK", label: "Swedish Krona"},
    SGD: {symbol: "SGD", label: "Singapore Dollar"},
    THB: {symbol: "THB", label: "Thai Baht"},
    TRY: {symbol: "TRY", label: "Turkish Lira"},
    ZAR: {symbol: "ZAR", label: "South African Rand"}
  },

  CRYPTO: {
    BTC: {symbol: "BTC", label: "Bitcoin"},
    SYS: {symbol: "SYS", label: "Syscoin"},
    ZEC: {symbol: "ZEC", label: "ZCash"},
    ETH: {symbol: "ETH", label: "Ethereum"},
    DASH: {symbol: "DASH", label: "Dash"},
    XMR: {symbol: "XMR", label: "Monero"},
    FCT: {symbol: "FCT", label: "Factom"},
    WAVES: {symbol: "WAVES", label: "Waves"}
  }
};
