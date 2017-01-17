import CurrencyConversion, {CurrencyConversionType} from "./CurrencyConversion";
import BaseConversionDataSource from "./BaseConversionDataSource";
import * as Q from "q";
import {CurrencyConfig, PricePegEntry} from "../index";
import {getFixedRate} from "./Utils";
import {config} from "../config";

export default class CryptoConverter {

  public key:string;

  constructor(public currencyConversion:CurrencyConversion, public dataSources: BaseConversionDataSource[], public currencyConfig: CurrencyConfig = null) {
    this.key = currencyConversion.fromCurrencySymbol + currencyConversion.toCurrencySymbol;
  }

  fetchRateData = () => {
    let requests = [];
    this.dataSources.map(conversionDataSource => {
      requests.push(conversionDataSource.fetchCurrencyConversionData());
    });

    return Q.all(requests);
  };

  refreshAverageExchangeRate = () => {
    let deferred = Q.defer();

    this.fetchRateData().then(results => {
      deferred.resolve(this.getAveragedExchangeRate());
    });

    return deferred.promise;
  };

  getAveragedExchangeRate = () => {
    //first get the average across all the conversions
    let avgSum = 0;

    for (let i = 0; i < this.dataSources.length; i++) {
      avgSum += this.dataSources[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    let avgVal = avgSum / this.dataSources.length;

    return avgVal;
  };

  /*
    Assumes toCurrencyBTCValue is in satoshi
   */
  getAmountToEqualOne = (toCurrencyBTCValue) => {
    let one = toCurrencyBTCValue / this.getAveragedExchangeRate();

    return one;
  };

  getSYSPegFormat = (conversionDataSources: CryptoConverter[]): PricePegEntry => {
    let pegEntry: PricePegEntry = {
      currency: this.currencyConversion.fromCurrencySymbol,
      rate: this.getCalculatedExchangeRate(conversionDataSources),
      precision: this.currencyConfig.precision ? this.currencyConfig.precision : 2
    };

    if(this.currencyConfig.fee)
        pegEntry.fee = this.currencyConfig.fee;

    if(this.currencyConfig.escrowFee)
        pegEntry.escrowfee = this.currencyConfig.escrowFee;

    return pegEntry;
  };

  getCalculatedExchangeRate = (conversionDataSources: CryptoConverter[]): number => {
    let exchangedRate = 1;
    switch(this.currencyConversion.fromCurrencySymbol) {
      case CurrencyConversionType.FIAT.USD.symbol:
          exchangedRate = getFixedRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol, conversionDataSources), 2);
        break;

      default:
          throw new Error("No currency config defined for getCalculatedExchangeRate or not found- " + this.currencyConversion.fromCurrencySymbol);
    }

    return exchangedRate;
  };

  getSYSFiatValue = (fiatType, conversionDataSources: CryptoConverter[]) => {
    let convertedValue;
    switch (fiatType) {
      case CurrencyConversionType.FIAT.USD.symbol:
        convertedValue = 1 / conversionDataSources[CurrencyConversionType.CRYPTO.BTC.symbol + CurrencyConversionType.FIAT.USD.symbol].getAveragedExchangeRate();
        convertedValue = convertedValue / conversionDataSources[CurrencyConversionType.CRYPTO.SYS.symbol + CurrencyConversionType.CRYPTO.BTC.symbol].getAveragedExchangeRate();

        //if debug is enabled artificially increment USD only by config'd amount
        if (config.enablePegUpdateDebug) {
          convertedValue += config.debugPegUpdateIncrement;
        }
        break;
    }

    return convertedValue;
  };
}