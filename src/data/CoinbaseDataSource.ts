
import BaseConversionDataSource from './BaseConversionDataSource';
import CurrencyConversion from './CurrencyConversion';
import {CurrencyConversionType} from "./CurrencyConversion";

export default class CoinbaseDataSource extends BaseConversionDataSource {
  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    //console.log("Handling response in coinbase handler.", rawCurrencyResponseData.btc_to_usd);
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, rawCurrencyResponseData.btc_to_usd);
  }
};

