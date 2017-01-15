import BaseConversionDataSource from "./BaseConversionDataSource";

export default class FixerFiatDataSource extends BaseConversionDataSource {
  
  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    //rather than returning an CurrencyConversion object this returns an object that has properties for each of the fiat
    //currencies.
    
    this.formattedCurrencyConversionData = {
      AUD: rawCurrencyResponseData.rates.AUD,
      BGN: rawCurrencyResponseData.rates.BGN,
      BRL: rawCurrencyResponseData.rates.BRL,
      CAD: rawCurrencyResponseData.rates.CAD,
      CHF: rawCurrencyResponseData.rates.CHF,
      CNY: rawCurrencyResponseData.rates.CNY,
      CZK: rawCurrencyResponseData.rates.CZK,
      DKK: rawCurrencyResponseData.rates.DKK,
      EUR: rawCurrencyResponseData.rates.EUR,
      GBP: rawCurrencyResponseData.rates.GBP,
      HKD: rawCurrencyResponseData.rates.HKD,
      HRK: rawCurrencyResponseData.rates.HRK,
      HUF: rawCurrencyResponseData.rates.HUF,
      IDR: rawCurrencyResponseData.rates.IDR,
      ILS: rawCurrencyResponseData.rates.ILS,
      INR: rawCurrencyResponseData.rates.INR,
      JPY: rawCurrencyResponseData.rates.JPY,
      KRW: rawCurrencyResponseData.rates.KRW,
      MXN: rawCurrencyResponseData.rates.MXN,
      MYR: rawCurrencyResponseData.rates.MYR,
      NOK: rawCurrencyResponseData.rates.NOK,
      NZD: rawCurrencyResponseData.rates.NZD,
      PHP: rawCurrencyResponseData.rates.PHP,
      PLN: rawCurrencyResponseData.rates.PLN,
      RON: rawCurrencyResponseData.rates.RON,
      RUB: rawCurrencyResponseData.rates.RUB,
      SEK: rawCurrencyResponseData.rates.SEK,
      SGD: rawCurrencyResponseData.rates.SGD,
      THB: rawCurrencyResponseData.rates.THB,
      TRY: rawCurrencyResponseData.rates.TRY,
      ZAR:rawCurrencyResponseData.rates.ZAR
    }
  };
}
