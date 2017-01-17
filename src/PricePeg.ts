import {
  logPegMessage,
  logPegMessageNewline,
  getPercentChange,
  readFromFile,
  validateUpdateHistoryLogFormat,
  writeToFile
} from "./data/Utils";
import config from "./config";
import FixerFiatDataSource from "./data/FixerFiatDataSource";
import {CurrencyConversionType} from "./data/CurrencyConversion";
import CryptoConverter from "./data/CryptoConverter";
import * as Q from "q";
import {PricePegModel, HistoryLog} from "./index";

const syscoin = require('syscoin');

const client = new syscoin.Client({
  host: config.rpcserver,
  port: config.rpcport,
  user: config.rpcuser,
  pass: config.rpcpassword,
  timeout: config.rpctimeout
});


//holds mock peg data for sync testing
const mockPeg: PricePegModel = {
  "rates": [
    {"currency": "USD", "rate": 0.5, "escrowfee": 0.005, "precision": 2},
    {"currency": "EUR", "rate": 2695.2, "escrowfee": 0.005, "precision": 2},
    {"currency": "GBP", "rate": 2697.3, "escrowfee": 0.005, "precision": 2},
    {"currency": "CAD", "rate": 2698.0, "escrowfee": 0.005, "precision": 2},
    {"currency": "BTC", "rate": 100000.0, "fee": 75, "escrowfee": 0.01, "precision": 8},
    {"currency": "ZEC", "rate": 10000.0, "fee": 50, "escrowfee": 0.01, "precision": 8},
    {"currency": "SYS", "rate": 1.0, "fee": 1000, "escrowfee": 0.005, "precision": 2}
  ]
};

interface ConverterCollection {
  [ key: string ]: CryptoConverter;
}

export default class PricePeg {
  public startTime = null;
  public updateHistory: HistoryLog = [];
  public sysRates: PricePegModel = null;
  public updateInterval = null;

  private fiatDataSource = new FixerFiatDataSource("USD", "US Dollar", "http://api.fixer.io/latest?base=USD"); //used to extrapolate other Fiat/SYS pairs off SYS/USD
  private conversionDataSources: CryptoConverter[];
  private conversionKeys = {
    BTCUSD: CurrencyConversionType.CRYPTO.BTC.symbol + CurrencyConversionType.FIAT.USD.symbol,
    SYSBTC: CurrencyConversionType.CRYPTO.SYS.symbol + CurrencyConversionType.CRYPTO.BTC.symbol,
  };

  constructor(public configuredDataProvider: CryptoConverter[]) {
    console.log("construct", JSON.stringify(configuredDataProvider));
    if (!config.enableLivePegUpdates) {
      this.fiatDataSource.formattedCurrencyConversionData = mockPeg;
    }

    //setup conversions for currencies this peg will support
    //CryptoConverter should only be used for exchanges which there is a direct API for, anything
    //further conversions should happen in subclasses or this class
    let conversion = null;
    let btcUSDExists = false;
    let sysBTCExists = false;
    // if(configuredDataProvider != null) {
    //   for(let i = 0; i < configuredDataProvider.length; i++) {
    //     this.conversionDataSources[configuredDataProvider[i].key] = configuredDataProvider[i];
    //     if(configuredDataProvider[i].key == this.conversionKeys.BTCUSD) {
    //       btcUSDExists = true;
    //     }
    //     console.log("don--" + i);
    //     if(configuredDataProvider[i].key == this.conversionKeys.SYSBTC) {
    //       sysBTCExists = true;
    //     }
    //   }
    // }
    //console.log("don1");
    // if(!btcUSDExists) { //always need this data source, just do not display results
    //   let conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1, CurrencyConversionType.FIAT.USD.symbol, CurrencyConversionType.FIAT.USD.label, 1);
    //   this.conversionDataSources[this.conversionKeys.BTCUSD] = new CryptoConverter(conversion,
    //     [new ConversionDataSource(conversion, "https://coinbase.com/api/v1/currencies/exchange_rates", "btc_to_usd")], null);
    // }
    //
    // if(!sysBTCExists) { //always need this data source, just do not display results
    //   conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.SYS.symbol, CurrencyConversionType.CRYPTO.SYS.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    //   this.conversionDataSources[this.conversionKeys.SYSBTC] = new CryptoConverter(conversion,
    //     [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS", "result.Bid"),
    //       new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_SYS&depth=1", "bids")], null);
    // }

    //console.log("don");
    //BTC/USD
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1, CurrencyConversionType.FIAT.USD.symbol, CurrencyConversionType.FIAT.USD.label, 1);
    // this.conversionDataSources[this.conversionKeys.BTCUSD] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://coinbase.com/api/v1/currencies/exchange_rates", "btc_to_usd")]);

    //SYS/BTC
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.SYS.symbol, CurrencyConversionType.CRYPTO.SYS.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.SYSBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_SYS&depth=1", "bids")]);

    // //ZEC/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.ZEC.symbol, CurrencyConversionType.CRYPTO.ZEC.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.ZECBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-ZEC", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ZEC&depth=1", "bids")]);
    //
    // //ETH/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.ETH.symbol, CurrencyConversionType.CRYPTO.ETH.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.ETHBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-ETH", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=1", "bids")]);
    //
    // //DASH/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.DASH.symbol, CurrencyConversionType.CRYPTO.DASH.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.DASHBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-DASH", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_DASH&depth=1", "bids")]);
    //
    // //XMR/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.XMR.symbol, CurrencyConversionType.CRYPTO.XMR.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.XMRBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-XMR", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_XMR&depth=1", "bids")]);
    //
    // //FCT/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.FCT.symbol, CurrencyConversionType.CRYPTO.FCT.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.FCTBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-FCT", "result.Bid"),
    //     new PoloniexDataSource(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_FCT&depth=1", "bids")]);
    //
    // //WAVES/SYS
    // conversion = new CurrencyConversion(CurrencyConversionType.CRYPTO.WAVES.symbol, CurrencyConversionType.CRYPTO.WAVES.label, 1, CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversionType.CRYPTO.BTC.label, 1);
    // this.conversionDataSources[this.conversionKeys.WAVESBTC] = new CryptoConverter(conversion,
    //   [new ConversionDataSource(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-WAVES", "result.Bid")]);
  }

  start = () => {
    logPegMessage(`Starting PricePeg with config:
                    ${JSON.stringify(config)}`);

    if (config.enableLivePegUpdates)
      client.getInfo((err, info, resHeaders) => {
        if (err) {
          return logPegMessage(`Error: ${err}`);
        }
        logPegMessage(`Syscoin Connection Test. Current Blockheight: ${info.blocks}`);
      });

    this.startTime = Date.now();


    //try to load up any previous data
    this.loadUpdateHistory().then((log) => {
      let parseLog = JSON.parse(log);
      if(validateUpdateHistoryLogFormat(parseLog)) {
        if(config.logLevel.logUpdateLoggingEvents)
          logPegMessage("Peg update history loaded from file and validated.");
        this.updateHistory = parseLog;
      }else{
        if(config.logLevel.logUpdateLoggingEvents)
          logPegMessage("Peg update history loaded from file but was INVALID!")
      }

      this.startUpdateInterval();
    },
    (err) => {
      this.startUpdateInterval();
    });
  };

  stop = () => {
    this.stopUpdateInterval();
  };

  startUpdateInterval = () => {
    this.fiatDataSource.fetchCurrencyConversionData().then((result) => {
      if (!config.enablePegUpdateDebug) {
        this.refreshCurrentRates(true);

        this.updateInterval = setInterval(() => {
          this.refreshCurrentRates(true)
        }, config.updateInterval * 1000);
      } else {
        this.checkPricePeg();

        this.updateInterval = setInterval(() => {
          this.checkPricePeg();
        }, config.debugPegUpdateInterval * 1000);
      }
    });
  };

  stopUpdateInterval = () => {
    clearInterval(this.updateInterval);
  };

  refreshCurrentRates = (checkForPegUpdate) => {
    let dataSources = [];

    for (let key in this.conversionDataSources) {
      dataSources.push(this.conversionDataSources[key].refreshAverageExchangeRate());
    }

    Q.all(dataSources).then((resultsArr) => {
      this.handleCurrentRateRefreshComplete(checkForPegUpdate);
    });
  };

  handleCurrentRateRefreshComplete = (checkForPegUpdate) => {
    if (config.logLevel.logNetworkEvents) {
      //any time we fetch crypto rates, fetch the fiat rates too
      logPegMessage(`Exchange rate refresh complete, check for peg value changes == ${checkForPegUpdate}`);
      logPegMessageNewline();
    }

    if (checkForPegUpdate) {
      this.checkPricePeg();
    }
  };

  loadUpdateHistory = (): Q.IPromise<string>  => {
    let deferred = Q.defer();
    readFromFile(config.updateLogFilename).then((log: string) => {
      deferred.resolve(log);
    }, (e) => deferred.reject(e));


    return deferred.promise;
  };

  getRate = (ratesObject: PricePegModel, searchSymbol: string): number => {
    let rate = null;

    ratesObject.rates.map((rateObj) => {
      if(rateObj.currency == searchSymbol)
        rate = rateObj.rate;
    });

    return rate;
  };

  checkPricePeg = () => {
    let deferred = Q.defer();

    this.getPricePeg().then((currentValue: PricePegModel) => {
      if (config.logLevel.logPriceCheckEvents)
        logPegMessage(`Current peg value: ${JSON.stringify(currentValue)}`);

      if (this.sysRates == null) {
        if (config.logLevel.logPriceCheckEvents)
          logPegMessage(`No current value set, setting, setting first result as current value.`);

        this.sysRates = currentValue;
      }

      if (config.logLevel.logPriceCheckEvents)
        logPegMessageNewline();

      let newValue = this.convertToPricePeg();

      if (config.enablePegUpdateDebug) {
        this.setPricePeg(newValue, currentValue);
      } else {
        for(let i = 0; i < this.conversionDataSources.length; i++) {
          let currencyKey: string = this.conversionDataSources[i].key;
          let currentConversionRate = this.getRate(currentValue, currencyKey);
          let newConversionRate = this.getRate(newValue, currencyKey);

          if(currentConversionRate == null || newConversionRate == null) {
            throw new Error(`No such rate: ${currencyKey}`);
          }

          let percentChange = getPercentChange(newConversionRate, currentConversionRate);

          if (config.logLevel.logPriceCheckEvents) {
            logPegMessage(`Checking price for ${currencyKey}: Current v. new = ${currentConversionRate}  v. ${newConversionRate} == ${percentChange}% change`);
          }

          percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive

          if (percentChange > (config.updateThresholdPercentage * 100)) {
            if (config.logLevel.logBlockchainEvents)
              logPegMessage(`Attempting to update price peg, currency ${currencyKey} changed by ${percentChange}.`);

            this.setPricePeg(newValue, currentValue).then((result) => {
              deferred.resolve(result);
            });
          } else {
            deferred.resolve();
          }
        }
      }

    })

      .catch((err) => {
        logPegMessage("ERROR:" + err);
        deferred.reject(err);
      });

    return deferred.promise;
  };

  getPricePeg = () => {
    let deferred = Q.defer();

    if (!config.enableLivePegUpdates) {
      deferred.resolve(mockPeg);
    } else {
      client.aliasInfo(config.pegalias, (err, aliasinfo, resHeaders) => {
        if (err) {
          logPegMessage(`Error: ${err}`);
          return deferred.reject(err);
        }

        deferred.resolve(JSON.parse(aliasinfo.value));
      });
    }

    return deferred.promise;
  };

  setPricePeg = (newValue, oldValue) => {
    let deferred = Q.defer();

    //guard against updating the peg too rapidly
    let now = Date.now();
    let currentInterval = (1000 * 60 * 60 * 24) + (now - this.startTime);
    currentInterval = (currentInterval / (config.updatePeriod * 1000)) % 1; //get remainder of unfinished interval

    //see how many updates have happened in this period
    let currentIntervalStartTime = now - ((config.updatePeriod * 1000) * currentInterval);

    let updatesInThisPeriod = 0;
    if (config.logLevel.logBlockchainEvents)
      logPegMessage(`Attempting to update price peg if within safe parameters.`);

    updatesInThisPeriod += this.updateHistory.filter((item) => {
      return item.date > currentIntervalStartTime;
    }).length;

    if (updatesInThisPeriod <= config.maxUpdatesPerPeriod) {
      if (config.enableLivePegUpdates) {
        client.aliasUpdate(config.pegalias, config.pegalias_aliaspeg, JSON.stringify(newValue), (err, result, resHeaders) => {
          if (err) {
            logPegMessage(`ERROR: ${err}`);
            logPegMessageNewline();
            deferred.reject(err);
          } else {
            this.logUpdate(newValue, oldValue); //always store the pre-update value so it makes sense when displayed
            deferred.resolve(result);
          }
        });
      } else {
        this.logUpdate(newValue, oldValue);
        deferred.resolve(newValue);
      }
    } else {
      logPegMessage(`ERROR - Unable to update peg, max updates of [${config.maxUpdatesPerPeriod}] would be exceeded. Not updating peg.`);
      logPegMessageNewline();
      deferred.reject(null);
    }

    return deferred.promise;
  };

  logUpdate = (newValue, oldValue) => {
    //store prev value
    this.updateHistory.push({
      date: Date.now(),
      value: oldValue
    });

    //write updated history object to file
    writeToFile(config.updateLogFilename, JSON.stringify(this.updateHistory), false).then((result) => {
      console.log("Update log history written to successfully");
    });

    this.sysRates = newValue;

    if (config.logLevel.logBlockchainEvents) {
      logPegMessage(`Price peg updated successfully.`);
      logPegMessageNewline();
    }
  };

  convertToPricePeg = (): PricePegModel => {
    const peg = {
      rates: []
    };

    for(let i = 0; i < this.conversionDataSources.length; i++) {
      if(this.conversionDataSources[i].currencyConfig != null) {
        peg.rates.push(this.conversionDataSources[i].getSYSPegFormat(this.conversionDataSources));
      }
    }
        // {
        //   currency: CurrencyConversionType.FIAT.USD.symbol,
        //   rate: getFixedRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol), 2),
        //   precision: 2
        // },
        // {
        //   "currency": CurrencyConversionType.FIAT.EUR.symbol,
        //   "rate": getFiatExchangeRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol), this.fiatDataSource.formattedCurrencyConversionData.EUR, 2),
        //   "escrowfee": 0.005,
        //   "precision": 2
        // },
        // {
        //   "currency": CurrencyConversionType.FIAT.GBP.symbol,
        //   "rate": getFiatExchangeRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol), this.fiatDataSource.formattedCurrencyConversionData.GBP, 2),
        //   "escrowfee": 0.005,
        //   "precision": 2
        // },
        // {
        //   "currency": CurrencyConversionType.FIAT.CAD.symbol,
        //   "rate": getFiatExchangeRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol), this.fiatDataSource.formattedCurrencyConversionData.CAD, 2),
        //   "escrowfee": 0.005,
        //   "precision": 2
        // },
        // {
        //   "currency": CurrencyConversionType.FIAT.CNY.symbol,
        //   "rate": getFiatExchangeRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD.symbol), this.fiatDataSource.formattedCurrencyConversionData.CNY, 4),
        //   "escrowfee": 0.005,
        //   "precision": 4
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.BTC.symbol,
        //   "rate": getFixedRate(1 / this.conversionDataSources[this.conversionKeys.SYSBTC].getAveragedExchangeRate(), 8),
        //   "escrowfee": 0.01,
        //   "fee": 75,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.SYS.symbol,
        //   "rate": getFixedRate(1.0, 2),
        //   "escrowfee": 0.005,
        //   "fee": 1000,
        //   "precision": 2
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.ZEC.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.ZECBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.ETH.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.ETHBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.DASH.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.DASHBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.XMR.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.XMRBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.FCT.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.FCTBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // },
        // {
        //   "currency": CurrencyConversionType.CRYPTO.WAVES.symbol,
        //   "rate": getFixedRate(parseFloat(this.conversionDataSources[this.conversionKeys.SYSBTC].getAmountToEqualOne(this.conversionDataSources[this.conversionKeys.WAVESBTC].getAveragedExchangeRate()).toString()), 8),
        //   "escrowfee": 0.01,
        //   "fee": 50,
        //   "precision": 8
        // }
    //  ]
    //};

    return peg;
  };
};
