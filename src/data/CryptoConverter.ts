import CurrencyConversion, {CurrencyConversionType} from "./CurrencyConversion";
import BaseConversionDataSource from "./BaseConversionDataSource";
import * as Q from "q";
import {CurrencyConfig, PricePegEntry} from "../common";
import {getFixedRate, getFiatExchangeRate} from "./Utils";
import FixerFiatDataSource from "./FixerFiatDataSource";
import {conversionKeys} from "../PricePeg";
import {getConfig} from "../config";

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
    }, (err) => {
      deferred.reject(err);
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

  getPegCurrency = () => {
    let currency = this.currencyConversion.fromCurrencySymbol;

    //if fiat then use the to currency symbol
    if ((this.currencyConfig && this.currencyConfig.isFiat) ||
      (this.currencyConfig == null && this.currencyConversion.fromCurrencySymbol == CurrencyConversionType.CRYPTO.BTC.symbol) ||
      (this.currencyConfig && this.key == conversionKeys.SYSBTC))
      currency = this.currencyConversion.toCurrencySymbol;

    return currency;
  };

  getSYSPegFormat = (conversionDataSources: CryptoConverter[], fiatDatSource: FixerFiatDataSource): PricePegEntry => {
    let pegEntry: PricePegEntry = {
      currency: this.getPegCurrency(),
      rate: this.getCalculatedExchangeRate(conversionDataSources, fiatDatSource),
      precision: this.currencyConfig.precision ? this.currencyConfig.precision : 2
    };

    if(this.currencyConfig.fee)
        pegEntry.fee = this.currencyConfig.fee;

    if(this.currencyConfig.escrowFee)
        pegEntry.escrowfee = this.currencyConfig.escrowFee;

    return pegEntry;
  };

  getCalculatedExchangeRate = (conversionDataSources: CryptoConverter[], fiatDataSource): number => {
    let exchangedRate = -1;
    let precision = this.currencyConfig ? this.currencyConfig.precision : 2;

    //there will always be a conversion BTC/USD, even if not displayed
    if (this.key == CurrencyConversionType.CRYPTO.BTC.symbol + CurrencyConversionType.FIAT.USD.symbol) {
      //return early
      return getFixedRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol, conversionDataSources), precision);
    }

    //there will always be a conversion SYS/BTC, even if not displayed
    if (this.key == CurrencyConversionType.CRYPTO.SYS.symbol + CurrencyConversionType.CRYPTO.BTC.symbol) {
      //return early
      return getFixedRate(1 / conversionDataSources[this.key].getAveragedExchangeRate(), this.currencyConfig.precision);
    }

    if (this.currencyConfig.isFiat) {
      exchangedRate = getFiatExchangeRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol, conversionDataSources), fiatDataSource.formattedCurrencyConversionData[this.currencyConfig.currencySymbol], precision);
    } else if (this.key == CurrencyConversionType.CRYPTO.SYS.symbol + CurrencyConversionType.CRYPTO.SYS.symbol) {
      exchangedRate = 1;
    } else {
      exchangedRate = getFixedRate(parseFloat(conversionDataSources[conversionKeys.SYSBTC].getAmountToEqualOne(conversionDataSources[this.key].getAveragedExchangeRate()).toString()), precision);
    }

    if (exchangedRate == -1) { //exchange rate not found
      throw new Error("No currency config defined for getCalculatedExchangeRate or not found- " + this.key);
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
        if (getConfig().enablePegUpdateDebug) {
          convertedValue += getConfig().debugPegUpdateIncrement;
        }
        break;
    }

    return convertedValue;
  };
}