import BaseConversionDataSource from "./BaseConversionDataSource";
import CurrencyConversion from "./CurrencyConversion";
import {getDeepValue} from "./Utils";

export default class ConversionDataSource extends BaseConversionDataSource {

  constructor(public currencyConversion: CurrencyConversion, public dataUrl: string, public responseDataPath: string = null) {
    super(currencyConversion.fromCurrencySymbol, currencyConversion.fromCurrencyLabel, dataUrl, responseDataPath);
  }

  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, this.currencyConversion.toCurrencySymbol, this.currencyConversion.toCurrencyLabel, getDeepValue(rawCurrencyResponseData, this.responseDataPath));
  };
}
