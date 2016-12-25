
import getDeepValue from './Utils';
import BaseConversionDataSource from './BaseConversionDataSource';
import CurrencyConversion from './CurrencyConversion';

export default class  PoloniexDataSource extends BaseConversionDataSource {
  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    //console.log("Handling response in poloniex handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", getDeepValue(rawCurrencyResponseData, this.responseDataPath));
  };
}
