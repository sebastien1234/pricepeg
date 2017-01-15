import * as Q from "q";
import {readFromFile, getCurrencyData} from "./data/Utils";
import {CurrencyConfig, ConversionDataEntry} from "./index";
import PricePeg from "./PricePeg";
import CurrencyConversion from "./data/CurrencyConversion";

export default class SetupWizard {
  constructor() {

  };

  public setup = (configJsonFilePath: string) => {
    let deferred = Q.defer();

    readFromFile(configJsonFilePath).then((contents) => {
      let currencyConfig = JSON.parse(contents);
      if(this.validateCurrencyConfig(currencyConfig)) {
        console.log("VALID CONFIG.");
        this.generatePegDataSourceObject(currencyConfig);
        deferred.resolve(JSON.parse(contents));
      }else{
        console.log("INVALID CONFIG.");
      }
    },
    (err) => {
      console.log("Error reading currency config file!");
      deferred.reject(err);
    });

    return deferred.promise;
  };

  validateCurrencyConfig = (configObj: CurrencyConfig[] ): boolean => {
    if(configObj && configObj.length) {
      console.log("validating " + configObj.length + " configs");
      for(let i = 0; i < configObj.length; i++) {
        let configEntry = configObj[i];
        console.log("Validating: ", JSON.stringify(configEntry));
        if(PricePeg.supportedCurrencies.indexOf(configEntry.currencySymbol) == -1) {
          this.invalidConfigError(`Unsupported currency symbol: ${configEntry.currencySymbol}`);
          return false;
        }

        if(typeof configEntry.isFiat != 'boolean') {
          this.invalidConfigError(`isFiat must be true or false, current value ${configEntry.isFiat} is invalid.`);
          return false;
        }

        let dataSourcesArr = configEntry.dataSources.split(",");
        for(let x = 0; x < dataSourcesArr.length; x++) {
          let value = dataSourcesArr[x].trim().toLowerCase();
          if(value != "bittrex" && value != "poloniex") {
            this.invalidConfigError(`Only data sources of bittrex or poloniex are supported - ${value} is invalid.`);
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
    console.error(`Invalid currencies.conf file, details: ${reason}`);
  };

  generatePegDataSourceObject = (config: CurrencyConfig[]) => {
    let pegDataSourceArr= [];
    for(let i = 0; i < config.length; i ++) {
      let configEntry = config[i];
      let dataSourcesArr = configEntry.dataSources.split(",");

      //first build conversion object;
      let currencyConversion:CurrencyConversion;
      let currencyData:ConversionDataEntry = getCurrencyData(configEntry.currencySymbol);
      if(configEntry.isFiat) {
        currencyData =
        currencyConversion = new CurrencyConversion(config)
      }else{

      }
    }

  };

}
