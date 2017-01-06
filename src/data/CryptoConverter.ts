import CurrencyConversion from "./CurrencyConversion";
import BaseConversionDataSource from "./BaseConversionDataSource";
import * as Q from 'q';
import {config} from "../config";

export default class CryptoConverter {

  private key:string;

  constructor(public currentConversion:CurrencyConversion, public dataSources: BaseConversionDataSource[]) {
    this.key = currentConversion.fromCurrencySymbol + currentConversion.toCurrencySymbol;
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
}