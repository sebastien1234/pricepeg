import BaseConversionDataSource from "./BaseConversionDataSource";
import CurrencyConversion from "./CurrencyConversion";

export default class PoloniexDataSource extends BaseConversionDataSource {

  constructor(public currencyConversion: CurrencyConversion, public dataUrl: string, public responseDataPath: string = null) {
    super(currencyConversion.fromCurrencySymbol, currencyConversion.fromCurrencyLabel, dataUrl, responseDataPath);
  }

  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, this.currencyConversion.toCurrencySymbol, this.currencyConversion.toCurrencyLabel, rawCurrencyResponseData.bids[0][0]);
  };
}
