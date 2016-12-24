
import BaseConversionDataSource from './BaseConversionDataSource';
import CurrencyConversion from './CurrencyConversion';

export default class BittrexDataSource extends BaseConversionDataSource {
  formatCurrencyConversionData = (rawCurrencyResponseData) => {
    console.log("Handling response in bittrex handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.result.Bid);
  };
};