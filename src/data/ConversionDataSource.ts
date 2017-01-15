import BaseConversionDataSource from "./BaseConversionDataSource";
import CurrencyConversion from "./CurrencyConversion";

export default class ConversionDataSource extends BaseConversionDataSource {

  constructor(public currencyConversion: CurrencyConversion, public dataUrl: string, public responseDataPath: string = null) {
    super(currencyConversion.fromCurrencySymbol, currencyConversion.fromCurrencyLabel, dataUrl, responseDataPath);
  }

  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    try {
      this.formattedCurrencyConversionData = this.currencyConversion;
      this.formattedCurrencyConversionData.toCurrencyAmount = parseFloat(rawCurrencyResponseData[this.responseDataPath]);
    }catch(e) {
      console.log("Error settings Formateted data", JSON.stringify(this.currencyConversion));
    }

  };
}
