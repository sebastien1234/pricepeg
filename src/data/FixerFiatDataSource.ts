
import BaseConversionDataSource from "./BaseConversionDataSource";

export default class FixerFiatDataSource extends BaseConversionDataSource {
  formatCurrencyConversionData = (rawCurrencyResponseData) => {
    //rather than returning an CurrencyConversion object this returns an object that has properties for each of the fiat
    //currencies. Intended to be used against USD only.
    //supported:
    //{"AUD":1.3109,"BGN":1.7152,"BRL":3.4849,"CAD":1.2528,"CHF":0.96326,"CNY":6.4845,"CZK":23.711,"DKK":6.5281,"GBP":0.68425,
    // "HKD":7.7581,"HRK":6.5869,"HUF":273.81,"IDR":13185,"ILS":3.7416,"INR":66.385,"JPY":107.29,"KRW":1141.4,"MXN":17.151,
    // "MYR":3.9065,"NOK":8.0812,"NZD":1.4344,"PHP":46.921,"PLN":3.8556,"RON":3.9262,"RUB":64.219,"SEK":8.0408,"SGD":1.3427,
    // "THB":34.92,"TRY":2.8005,"ZAR":14.169,"EUR":0.87696}
    this.formattedCurrencyConversionData = {
      CAD: rawCurrencyResponseData.rates.CAD,
      CNY: rawCurrencyResponseData.rates.CNY,
      GBP: rawCurrencyResponseData.rates.GBP,
      EUR: rawCurrencyResponseData.rates.EUR
    }
  };
}
