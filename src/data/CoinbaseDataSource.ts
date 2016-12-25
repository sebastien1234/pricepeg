
import BaseConversionDataSource from './BaseConversionDataSource';
import CurrencyConversion from './CurrencyConversion';

export default class CoinbaseDataSource extends BaseConversionDataSource {
  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    //console.log("Handling response in coinbase handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.btc_to_usd);
  }
};

