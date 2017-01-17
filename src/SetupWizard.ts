import * as Q from "q";
import {readFromFile, getCurrencyData, DATA_SOURCE, logPegMessage} from "./data/Utils";
import {CurrencyConfig, CurrencyData, supportedCurrencies} from "./common";
import CurrencyConversion, {CurrencyConversionType} from "./data/CurrencyConversion";
import CryptoConverter from "./data/CryptoConverter";
import ConversionDataSource from "./data/ConversionDataSource";
import BaseConversionDataSource from "./data/BaseConversionDataSource";
import PoloniexDataSource from "./data/PoloniexDataSource";

export default class SetupWizard {
  constructor() {

  };

  public setup = (configJsonFilePath: string) => {
    let deferred = Q.defer();

    readFromFile(configJsonFilePath).then((contents) => {
      let currencyConfig;
      try {
        currencyConfig = JSON.parse(contents);
      }catch(e) {
        logPegMessage("ERROR: Error parsing JSON from config: " + JSON.stringify(e));
      }

      if(this.validateCurrencyConfig(currencyConfig)) {
        logPegMessage("VALID CONFIG.");
        deferred.resolve(this.generatePegDataSourceObject(currencyConfig));
      }else{
        logPegMessage("INVALID CONFIG.");
        deferred.reject("INVALID CONFIG.")
      }
    },
    (err) => {
      logPegMessage(`Error reading currency config file! ${JSON.stringify(err)}`);
      deferred.reject(err);
    });

    return deferred.promise;
  };

  validateCurrencyConfig = (configObj: CurrencyConfig[] ): boolean => {
    if(configObj && configObj.length) {
      for(let i = 0; i < configObj.length; i++) {
        let configEntry = configObj[i];
        let currencySupported = false;
        for(let x = 0; x < supportedCurrencies.length; x++) {
          if(supportedCurrencies[x].symbol == configEntry.currencySymbol) {
            currencySupported = true;
            break;
          }
        }

        if(!currencySupported) {
          this.invalidConfigError(`Unsupported currency symbol: ${configEntry.currencySymbol}`);
          return false;
        }

        if(typeof configEntry.isFiat != 'boolean') {
          this.invalidConfigError(`isFiat must be true or false, current value ${configEntry.isFiat} is invalid.`);
          return false;
        }

        if(!configEntry.isFiat && configEntry.currencySymbol != CurrencyConversionType.CRYPTO.SYS.symbol) {
          if(configEntry.dataSources) {
            let dataSourcesArr = configEntry.dataSources.split(",");
            for (let x = 0; x < dataSourcesArr.length; x++) {
              let value = dataSourcesArr[x].trim().toLowerCase();
              if (value != DATA_SOURCE.BITTREX && value != DATA_SOURCE.POLONIEX) {
                this.invalidConfigError(`Only data sources of ${DATA_SOURCE.BITTREX} or ${DATA_SOURCE.POLONIEX} are supported - ${value} is invalid.`);
                return false;
              }
            }
          }else{
            this.invalidConfigError(`Datasources must be specified for non-fiat currencies. No datasources found for ${configEntry.currencySymbol}`);
            return false;
          }
        }

        if(configEntry.escrowFee && typeof configEntry.escrowFee != 'number') {
          this.invalidConfigError(`escrowFee must be number, is invalid type for symbol ${configEntry.currencySymbol}`);
          return false;
        }

        if(configEntry.fee && typeof configEntry.fee != 'number') {
          this.invalidConfigError(`fee must be number, is invalid type for symbol ${configEntry.currencySymbol}`);
          return false;
        }

        if(configEntry.precision && typeof configEntry.precision != 'number') {
          this.invalidConfigError(`precision must be number, is invalid type for symbol ${configEntry.currencySymbol}`);
          return false;
        }

        if(configEntry.precision < 0 || configEntry.precision > 8) {
          this.invalidConfigError(`precision for symbol ${configEntry.currencySymbol} out of range - must be between 0 and 8`);
          return false;
        }
      }

      return true;
    }

    return false;
  };

  invalidConfigError = (reason: string) => {
    logPegMessage(`ERROR: Invalid currencies.conf file, details: ${reason}`);
  };

  getDataSourcesFromConfig = (dataSourceConfigStr: string, currencyConversion: CurrencyConversion): BaseConversionDataSource[] => {
    let dataSourcesArr = dataSourceConfigStr.split(",");
    let conversionDataSources: BaseConversionDataSource[] = [];
    for(let i = 0; i < dataSourcesArr.length; i++) {
      switch(dataSourcesArr[i].toLowerCase()) {
        case DATA_SOURCE.BITTREX:
          conversionDataSources.push(new ConversionDataSource(currencyConversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-" + currencyConversion.fromCurrencySymbol, "result.Bid"));
          break;

        case DATA_SOURCE.POLONIEX:
          conversionDataSources.push(new PoloniexDataSource(currencyConversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_" + currencyConversion.fromCurrencySymbol + "&depth=1", "bids"));
          break;
      }
    }

    return conversionDataSources;
  };

  generatePegDataSourceObject = (config: CurrencyConfig[]) => {
    let currencyConversionDataSources: CryptoConverter[] = [];
    for(let i = 0; i < config.length; i ++) {
      let configEntry = config[i];

      //first build conversion object;
      let currencyConversion: CurrencyConversion;
      let currencyData:CurrencyData = getCurrencyData(configEntry.currencySymbol);

      if(configEntry.isFiat) {  //fiat currencies are always calculated from BTC to the fist currency
        currencyConversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1, currencyData.symbol, currencyData.label, 1);
        let coinbaseDataSource = new ConversionDataSource(currencyConversion, "https://coinbase.com/api/v1/currencies/exchange_rates", "btc_to_usd");
        let dataSourcesArr = currencyData.symbol == CurrencyConversionType.FIAT.USD.symbol ? [coinbaseDataSource] : [];
        currencyConversionDataSources.push(new CryptoConverter(currencyConversion, dataSourcesArr, configEntry));
      }else{
        if(configEntry.currencySymbol != CurrencyConversionType.CRYPTO.SYS.symbol) {
          if(configEntry.currencySymbol == CurrencyConversionType.CRYPTO.BTC.symbol) {
            //if the conversion is to BTC the currencyConversion object needs to be from SYS to BTC
            currencyConversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.SYS.symbol, CurrencyConversionType.CRYPTO.SYS.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
            currencyConversionDataSources.push(new CryptoConverter(currencyConversion, this.getDataSourcesFromConfig(configEntry.dataSources, currencyConversion), configEntry));
          }else{
            //cryptocurrencies always are converted to BTC, and converter will handle the final conversion to SYS
            currencyConversion = new CurrencyConversion(currencyData.symbol, currencyData.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
            currencyConversionDataSources.push(new CryptoConverter(currencyConversion, this.getDataSourcesFromConfig(configEntry.dataSources, currencyConversion), configEntry));
          }
        }else{
          //if the conversion is to SYS its 1:1
          currencyConversion = new CurrencyConversion(currencyData.symbol, currencyData.label, 1, CurrencyConversionType.CRYPTO.SYS.symbol, CurrencyConversionType.CRYPTO.SYS.label, 1);
          currencyConversionDataSources.push(new CryptoConverter(currencyConversion, [], configEntry));
        }
      }
    }

    return currencyConversionDataSources;
  };

}
