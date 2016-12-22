'use strict'

var fs = require('fs');
var Q = require('q');

var config = require('./config');
var BittrrexDataSource = require('./data/BittrexDataSource');
var PoloniexDataSource = require('./data/PoloniexDataSource');
var CoinbaseDataSource = require('./data/CoinbaseDataSource');
var FixerFiatDataSource = require('./data/FixerFiatDataSource');
var CurrencyConversionType = require('./data/CurrencyConversion').CurrencyConversionType;
var syscoin = require('syscoin');

var client = new syscoin.Client({
  host: config.rpcserver,
  port: config.rpcport,
  user: config.rpcuser,
  pass: config.rpcpassword,
  timeout: config.rpctimeout
});

/*
 interface PricePegEntry {
 currency: string;
 rate: number; // how many SYS equal 1 of this currency
 fee?: number; // fee per byte on transactions in satoshis, defaults to 25
 escrowfee?: number; // escrow fee % for arbiters on offers that use this peg, defaults to 0.005 (0.05%)
 precision: number; // int
 } */

//holds mock peg data for sync testing
var mockPeg = {
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

var disableLiveCalls = config.disableLiveCalls,
  debugUpdates = config.debugUpdates,
  debugUpdatesInterval = config.debugUpdatesInterval,
  debugUpdateUpdatesIncrement = config.debugUpdatesIncrement;

function PricePeg() {
  this.sysBTCConversionValue = 0;
  this.sysZECConversionValue = 0
  this.btcUSDConversionValue = 0;

  this.startTime = null;
  this.updateHistory = [];
  this.sysRates = null;

  this.updateInterval = null;

  this.fiatDataSource = new FixerFiatDataSource("USD", "US Dollar", "http://api.fixer.io/latest?base=USD");

  this.SYSBTCConversionCache = [
    /*new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS"),*/
    new PoloniexDataSource(CurrencyConversionType.CRYPTO.SYS, "Syscoin", "https://poloniex.com/public?command=returnTicker", "BTC_SYS.last")
  ];

  this.ZECBTCConversionCache = [
    /*new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS"),*/
    new PoloniexDataSource(CurrencyConversionType.CRYPTO.ZEC, "ZCash", "https://poloniex.com/public?command=returnTicker", "BTC_ZEC.last")
  ];

  this.BTCFiatConversionCache = [
    new CoinbaseDataSource("USD", "US Dollar", "https://coinbase.com/api/v1/currencies/exchange_rates")
  ];

  if (disableLiveCalls) {
    this.fiatDataSource.formattedCurrencyConversionData = mockPeg;
  }
}

PricePeg.prototype = {
  constructor: PricePeg,

  start: function() {
    console.log("Starting PricePeg with config:", JSON.stringify(config));

    if(!disableLiveCalls)
      client.getInfo(function(err, info, resHeaders) {
        if (err) {
          console.log(err);
          return this.logPegMessage("Error: " + err);
        }
        console.log('Syscoin Connection Test. Current Blockheight: ', info.blocks);
      }.bind(this));

    this.startTime = Date.now();
    this.startUpdateInterval();
  },

  stop: function() {
    this.stopUpdateInterval();
  },

  startUpdateInterval: function () {
    this.fiatDataSource.fetchCurrencyConversionData().then(function (result) {
      if (!debugUpdates) {
        this.refreshCache(true);

        this.updateInterval = setInterval(function () {
          this.refreshCache(true)
        }.bind(this), config.updateInterval * 1000);
      } else {
        this.checkPricePeg();

        this.updateInterval = setInterval(function () {
          this.checkPricePeg();
        }.bind(this), debugUpdatesInterval * 1000);
      }
    }.bind(this));
  },

  stopUpdateInterval: function () {
    clearInterval(this.updateInterval);
  },

  refreshCache: function (checkForPegUpdate) {
    this.refreshAltsConversionCache(checkForPegUpdate);
    this.refreshBTCConversionCache(checkForPegUpdate);
  },

  refreshAltsConversionCache: function (checkForPegUpdate) {
    var cache = this.SYSBTCConversionCache.concat(this.ZECBTCConversionCache);
    for(var i = 0; i < cache.length; i++) {
      cache[i].fetchCurrencyConversionData().then(function (result) {
        this.isCacheRefreshComplete(checkForPegUpdate);
      }.bind(this));
    }
  },

  refreshBTCConversionCache: function (checkForPegUpdate) {
    for (var i = 0; i < this.BTCFiatConversionCache.length; i++) {
      this.BTCFiatConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        this.isCacheRefreshComplete(checkForPegUpdate);
      }.bind(this));
    }
  },

  isCacheRefreshComplete: function (checkForPegUpdate) {
    var allComplete = true;
    var cache = this.SYSBTCConversionCache.concat(this.ZECBTCConversionCache);
    for (var i = 0; i < cache.length; i++) {
      if (cache[i].pendingRequest) {
        allComplete = false;
      }
    }

    if (allComplete) {
      for (i = 0; i < this.BTCFiatConversionCache.length; i++) {
        if (this.BTCFiatConversionCache[i].pendingRequest) {
          allComplete = false;
        }
      }
    }

    if (allComplete) {
      //any time we fetch crypto rates, fetch the fiat rates too
      this.fiatDataSource.fetchCurrencyConversionData().then(function (result) {

        this.sysBTCConversionValue = this.getSYSBTCAverage();
        this.sysZECConversionValue = this.getSYSZECAverage();
        this.btcUSDConversionValue = this.getBTCUSDAverage();

        this.getSYSFiatValue(CurrencyConversionType.FIAT.USD);

        if (checkForPegUpdate) {
          this.checkPricePeg();
        }
      }.bind(this));
    }
  },

  checkPricePeg: function () {
    var deferred = Q.defer();

    this.getPricePeg().then(function(currentValue) {

      if (this.sysRates == null) {
        console.log("No current value set, setting:" + JSON.stringify(currentValue));
        this.sysRates = currentValue;
      }

      var newValue = this.convertToPricePeg();

      //console.log("NEW: ", JSON.stringify(newValue));
      //console.log("OLD: ", JSON.stringify(currentValue));

      if(debugUpdates) {
        this.setPricePeg(newValue, currentValue);
      }else{
        var percentChange = 0;
        if (newValue.rates[0].rate != currentValue.rates[0].rate) { //calc % change
          percentChange = ((newValue.rates[0].rate - currentValue.rates[0].rate) / currentValue.rates[0].rate) * 100;
        }

        this.logPegMessage("Checking price. Current v. new = " + currentValue.rates[0].rate + " v. " + newValue.rates[0].rate + " == " + percentChange + "% change");

        percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive

        if (percentChange > (config.updateThresholdPercentage * 100)) {
          this.logPegMessage("Attempting to update price peg.");
          this.setPricePeg(newValue, currentValue).then(function (result) {
            deferred.resolve(result);
          });
        } else {
          deferred.resolve();
        }
      }

    }.bind(this))

    .catch(function(err) {
      console.log("ERROR:" + err);
      deferred.reject(err);
    }.bind(this));

    return deferred.promise;
  },

  getPricePeg: function () {
    var deferred = Q.defer();

    if(disableLiveCalls) {
      deferred.resolve(mockPeg);
    }else{
      client.aliasInfo(config.pegalias, function (err, aliasinfo, resHeaders) {
        if (err) {
          console.log(err);
          this.logPegMessage("Error: " + err);
          return deferred.reject(err);
        }

        deferred.resolve(JSON.parse(aliasinfo.value));
      }.bind(this));
    }

    return deferred.promise;
  },

  setPricePeg: function (newValue, oldValue) {
    var deferred = Q.defer();

    //guard against updating the peg too rapidly
    var now = Date.now();
    var currentInterval = (1000 * 60 * 60 * 24) + (now - this.startTime);
    currentInterval = (currentInterval / (config.updatePeriod * 1000)) % 1; //get remainder of unfinished interval

    //see how many updates have happened in this period
    var currentIntervalStartTime = now - ((config.updatePeriod * 1000) * currentInterval);

    var updatesInThisPeriod = 0;
    console.log("trying to set");
    updatesInThisPeriod += this.updateHistory.filter(function (item) {
      return item.date > currentIntervalStartTime;
    }).length;

    if (updatesInThisPeriod <= config.maxUpdatesPerPeriod || debugUpdates) {
      if(!disableLiveCalls) {
        client.aliasUpdate(config.pegalias, config.pegalias_aliaspeg, JSON.stringify(newValue), function (err, result, resHeaders) {
          if (err) {
            console.log(err);
            this.logPegMessage("Error:" + err);
            deferred.reject(err);
          } else {
            this.logUpdate(newValue, oldValue); //always story the pre-update value so it makes sense when displayed
            deferred.resolve(result);
          }
        }.bind(this));
      }else{
        this.logUpdate(newValue, oldValue);
        deferred.resolve(newValue);
      }
    } else {
      this.logPegMessage("ERROR - Unable to update peg, max updates of [" + config.maxUpdatesPerPeriod + "] would be exceeded. Not updating peg.");
      deferred.reject();
    }

    return deferred.promise;
  },

  logUpdate: function (newValue, oldValue) {
    //store prev value
    this.updateHistory.push({
      date: Date.now(),
      value: oldValue
    });

    this.sysRates = newValue;

    this.logPegMessage("Price peg updated successfully.");
  },

  getFiatRate: function (usdRate, conversionRate, precision) {
    var rate = 0;

    rate = usdRate / conversionRate;

    return this.getFixedRate(rate, precision);
  },

  getSYSFiatValue: function (fiatType) {
    var convertedValue;
    switch (fiatType) {
      case "USD":
        convertedValue = 1 / this.btcUSDConversionValue;
        convertedValue = convertedValue / this.sysBTCConversionValue;
        break;
    }

    if (debugUpdates) {
      console.log("Current this.sysRates ", JSON.stringify(this.sysRates.rates));
      convertedValue = this.sysRates.rates[0].rate + debugUpdateUpdatesIncrement;
    }

    return convertedValue;
  },

  getFixedRate: function (rate, precision) {
    return parseFloat(parseFloat(rate).toFixed(precision));
  },

  convertToPricePeg: function () {
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
          "rate": this.getFixedRate(1 / parseFloat(this.sysBTCConversionValue), 8),
          "escrowfee": 0.01,
          "fee": 75,
          "precision": 8
        },
        {
          "currency": CurrencyConversionType.CRYPTO.ZEC,
          "rate": this.getFixedRate(parseFloat(this.sysZECConversionValue), 8),
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
  },

  getSYSBTCAverage: function(amount) {
    if (!amount)
      amount = 1;

    //first get the average across all the conversions
    var avgSum = 0;

    for(var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      avgSum += this.SYSBTCConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    var avgVal = avgSum / this.SYSBTCConversionCache.length;

    return avgVal * amount;
  },

  getSYSZECAverage: function(amount) {
    if (!amount)
      amount = 1;

    //first get the average across all the conversions
    var avgSum = 0;

    for(var i = 0; i < this.ZECBTCConversionCache.length; i++) {
      avgSum += this.ZECBTCConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    var avgZECVal = avgSum / this.ZECBTCConversionCache.length;
    var avgSYSVal = this.getSYSBTCAverage(amount);

    var avgVal = avgZECVal / avgSYSVal;

    console.log("ZEC:", avgZECVal + " n " + avgSYSVal);

    return avgVal * amount;
  },

  getBTCUSDAverage: function (amount) {
    if (!amount)
      amount = 1;

    //first get the average across all the conversions
    var avgSum = 0;

    for (var i = 0; i < this.BTCFiatConversionCache.length; i++) {
      avgSum += this.BTCFiatConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    var avgVal = avgSum / this.BTCFiatConversionCache.length;

    return avgVal * amount;
  },

  lookupBTCFiatConversion: function(fiatType) {
    //return the BTC conversion for a specific type of fiat, will support multiple
  },

  logPegMessage: function(msg) {
    msg = new Date() + " - " + msg;
    console.log(msg);
    fs.appendFile("./peg.log", msg + "\n", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  },

  getHumanDate: function (time) {
    // Create a new JavaScript Date object based on the timestamp
    var date = new Date(time);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
  }
};

module.exports = PricePeg;
