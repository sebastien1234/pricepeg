const fs = require('fs');
const Q = require('q');

import config from './config';
import BittrrexDataSource from './data/BittrexDataSource';
import PoloniexDataSource from './data/PoloniexDataSource';
import CoinbaseDataSource from './data/CoinbaseDataSource';
import FixerFiatDataSource from './data/FixerFiatDataSource';
import {CurrencyConversionType, default as CurrencyConversion} from './data/CurrencyConversion';
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

export default class PricePeg {

  public startTime = null;
  public updateHistory = [];
  public sysRates = null;
  public sysBTCConversionValue = 0;
  public sysZECConversionValue = 0;
  public btcUSDConversionValue = 0;

  public updateInterval = null;

  private fiatDataSource = new FixerFiatDataSource("USD", "US Dollar", "http://api.fixer.io/latest?base=USD");

  private SYSBTCConversionCache = [
    new BittrrexDataSource(CurrencyConversionType.CRYPTO.SYS, "ZCash", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS", "result.Bid"),
    new PoloniexDataSource(CurrencyConversionType.CRYPTO.SYS, "Syscoin", "https://poloniex.com/public?command=returnTicker", "BTC_SYS.last")
  ];

  private ZECBTCConversionCache = [
    new BittrrexDataSource(CurrencyConversionType.CRYPTO.ZEC, "Zcash", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-ZEC", "result.Bid"),
    new PoloniexDataSource(CurrencyConversionType.CRYPTO.ZEC, "ZCash", "https://poloniex.com/public?command=returnTicker", "BTC_ZEC.last")
  ];

  private BTCFiatConversionCache = [
    new CoinbaseDataSource("USD", "US Dollar", "https://coinbase.com/api/v1/currencies/exchange_rates")
  ];

  constructor() {
    if (!config.enableLivePegUpdates) {
      this.fiatDataSource.formattedCurrencyConversionData = mockPeg;
    }
  }

  start = () => {
    console.log("Starting PricePeg with config:", JSON.stringify(config));

    if(config.enableLivePegUpdates)
      client.getInfo((err, info, resHeaders) => {
        if (err) {
          console.log(err);
          return this.logPegMessage("Error: " + err);
        }
        console.log('Syscoin Connection Test. Current Blockheight: ', info.blocks);
      });

    this.startTime = Date.now();
    this.startUpdateInterval();
  };

  stop = () => {
    this.stopUpdateInterval();
  };

  startUpdateInterval = () => {
    this.fiatDataSource.fetchCurrencyConversionData().then((result) => {
      if (!config.enablePegUpdateDebug) {
        this.refreshCache(true);

        this.updateInterval = setInterval(() => {
          this.refreshCache(true)
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

  refreshCache = (checkForPegUpdate) => {
    let dataSources = this.SYSBTCConversionCache.concat(this.ZECBTCConversionCache.concat(this.BTCFiatConversionCache));
    dataSources.map(item => { return item.fetchCurrencyConversionData() });
    Q.all(dataSources).then((resultsArr) => {
      this.handleCacheRefreshComplete(checkForPegUpdate);
    });
  };

  handleCacheRefreshComplete = (checkForPegUpdate) => {
    //any time we fetch crypto rates, fetch the fiat rates too
    this.fiatDataSource.fetchCurrencyConversionData().then((result) => {

      this.sysBTCConversionValue = this.getSYSBTCAverage();
      this.sysZECConversionValue = this.getSYSZECAverage();
      this.btcUSDConversionValue = this.getBTCUSDAverage();

      this.getSYSFiatValue(CurrencyConversionType.FIAT.USD);

      if (checkForPegUpdate) {
        this.checkPricePeg();
      }
    });
  };

  checkPricePeg = () => {
    let deferred = Q.defer();

    this.getPricePeg().then((currentValue) => {

      if (this.sysRates == null) {
        console.log("No current value set, setting:" + JSON.stringify(currentValue));
        this.sysRates = currentValue;
      }

      let newValue = this.convertToPricePeg();

      //console.log("NEW: ", JSON.stringify(newValue));
      //console.log("OLD: ", JSON.stringify(currentValue));

      if(config.enablePegUpdateDebug) {
        this.setPricePeg(newValue, currentValue);
      }else{
        let percentChange = 0;
        if (newValue.rates[0].rate != currentValue.rates[0].rate) { //calc % change
          percentChange = ((newValue.rates[0].rate - currentValue.rates[0].rate) / currentValue.rates[0].rate) * 100;
        }

        this.logPegMessage("Checking price. Current v. new = " + currentValue.rates[0].rate + " v. " + newValue.rates[0].rate + " == " + percentChange + "% change");

        percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive

        if (percentChange > (config.updateThresholdPercentage * 100)) {
          this.logPegMessage("Attempting to update price peg.");
          this.setPricePeg(newValue, currentValue).then((result) => {
            deferred.resolve(result);
          });
        } else {
          deferred.resolve();
        }
      }

    })

    .catch((err) => {
      console.log("ERROR:" + err);
      deferred.reject(err);
    });

    return deferred.promise;
  };

  getPricePeg = () => {
    let deferred = Q.defer();

    if(!config.enableLivePegUpdates) {
      deferred.resolve(mockPeg);
    }else{
      client.aliasInfo(config.pegalias, (err, aliasinfo, resHeaders) => {
        if (err) {
          console.log(err);
          this.logPegMessage("Error: " + err);
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
    console.log("trying to set");
    updatesInThisPeriod += this.updateHistory.filter((item) => {
      return item.date > currentIntervalStartTime;
    }).length;

    if (updatesInThisPeriod <= config.maxUpdatesPerPeriod) {
      if(config.enableLivePegUpdates) {
        client.aliasUpdate(config.pegalias, config.pegalias_aliaspeg, JSON.stringify(newValue), (err, result, resHeaders) => {
          if (err) {
            console.log(err);
            this.logPegMessage("Error:" + err);
            deferred.reject(err);
          } else {
            this.logUpdate(newValue, oldValue); //always story the pre-update value so it makes sense when displayed
            deferred.resolve(result);
          }
        });
      }else{
        this.logUpdate(newValue, oldValue);
        deferred.resolve(newValue);
      }
    } else {
      this.logPegMessage("ERROR - Unable to update peg, max updates of [" + config.maxUpdatesPerPeriod + "] would be exceeded. Not updating peg.");
      deferred.reject();
    }

    return deferred.promise;
  };

  logUpdate = (newValue, oldValue) => {
    //store prev value
    this.updateHistory.push({
      date: Date.now(),
      value: oldValue
    });

    this.sysRates = newValue;

    this.logPegMessage("Price peg updated successfully.");
  };

  getFiatRate = (usdRate, conversionRate, precision) => {
    let rate = 0;

    rate = usdRate / conversionRate;

    return this.getFixedRate(rate, precision);
  };

  getSYSFiatValue = (fiatType) => {
    let convertedValue;
    switch (fiatType) {
      case "USD":
        convertedValue = 1 / this.btcUSDConversionValue;
        convertedValue = convertedValue / this.sysBTCConversionValue;
        break;
    }

    //if debug is enabled artificially increment by config'd amount
    if (config.enablePegUpdateDebug) {
      console.log("Current this.sysRates ", JSON.stringify(this.sysRates.rates));
      convertedValue = this.sysRates.rates[0].rate + config.debugPegUpdateIncrement;
    }

    return convertedValue;
  };

  getFixedRate = (rate, precision) => {
    return parseFloat(parseFloat(rate).toFixed(precision));
  };

  convertToPricePeg = () => {
    return {
      rates: [
        {
          currency: CurrencyConversionType.FIAT.USD,
          rate: this.getFixedRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD), 2),
          precision: 2
        },
        {
          "currency": CurrencyConversionType.FIAT.EUR,
          "rate": this.getFiatRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD), this.fiatDataSource.formattedCurrencyConversionData.EUR, 2),
          "escrowfee": 0.005,
          "precision": 2
        },
        {
          "currency": CurrencyConversionType.FIAT.GBP,
          "rate": this.getFiatRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD), this.fiatDataSource.formattedCurrencyConversionData.GBP, 2),
          "escrowfee": 0.005,
          "precision": 2
        },
        {
          "currency": CurrencyConversionType.FIAT.CAD,
          "rate": this.getFiatRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD), this.fiatDataSource.formattedCurrencyConversionData.CAD, 2),
          "escrowfee": 0.005,
          "precision": 2
        },
        {
          "currency": CurrencyConversionType.FIAT.CNY,
          "rate": this.getFiatRate(this.getSYSFiatValue(CurrencyConversionType.FIAT.USD), this.fiatDataSource.formattedCurrencyConversionData.CNY, 4),
          "escrowfee": 0.005,
          "precision": 4
        },
        {
          "currency": CurrencyConversionType.CRYPTO.BTC,
          "rate": this.getFixedRate(1 / parseFloat(this.sysBTCConversionValue.toString()), 8),
          "escrowfee": 0.01,
          "fee": 75,
          "precision": 8
        },
        {
          "currency": CurrencyConversionType.CRYPTO.ZEC,
          "rate": this.getFixedRate(parseFloat(this.sysZECConversionValue.toString()), 8),
          "escrowfee": 0.01,
          "fee": 50,
          "precision": 8
        },
        {
          "currency": CurrencyConversionType.CRYPTO.SYS,
          "rate": this.getFixedRate(1.0, 2),
          "escrowfee": 0.005,
          "fee": 1000,
          "precision": 2
        }
      ]
    }
  };

  getSYSBTCAverage = (amount: number = 1) => {
    //first get the average across all the conversions
    let avgSum = 0;

    for(let i = 0; i < this.SYSBTCConversionCache.length; i++) {
      avgSum += this.SYSBTCConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    let avgVal = avgSum / this.SYSBTCConversionCache.length;

    return avgVal * amount;
  };

  getSYSZECAverage = (amount: number = 1) => {
    //first get the average across all the conversions
    let avgSum = 0;

    for(let i = 0; i < this.ZECBTCConversionCache.length; i++) {
      avgSum += this.ZECBTCConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    let avgZECVal = avgSum / this.ZECBTCConversionCache.length;
    let avgSYSVal = this.getSYSBTCAverage(amount);

    let avgVal = avgZECVal / avgSYSVal;

    console.log("ZEC:", avgZECVal + " n " + avgSYSVal);

    return avgVal * amount;
  };

  getBTCUSDAverage = (amount: number = 1) => {
    //first get the average across all the conversions
    let avgSum = 0;

    for (let i = 0; i < this.BTCFiatConversionCache.length; i++) {
      avgSum += this.BTCFiatConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    let avgVal = avgSum / this.BTCFiatConversionCache.length;

    return avgVal * amount;
  };

  logPegMessage = (msg) => {
    msg = new Date() + " - " + msg;
    console.log(msg);
    fs.appendFile("./peg.log", msg + "\n", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  };
};

interface PricePegModel {
  rates: PricePegEntry[];
}

interface PricePegEntry {
  currency: string;
  rate: number; // how many SYS equal 1 of this currency
  fee?: number; // fee per byte on transactions in satoshis, defaults to 25
  escrowfee?: number; // escrow fee % for arbiters on offers that use this peg, defaults to 0.005 (0.05%)
  precision: number; // int
}
