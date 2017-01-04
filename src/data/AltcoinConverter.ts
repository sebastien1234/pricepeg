import CurrencyConversion from "./CurrencyConversion";
import BaseConversionDataSource from "./BaseConversionDataSource";

export default class AltcoinConverter {
  constructor(public currency:CurrencyConversion, public dataSources: BaseConversionDataSource[]) {

  }
}