'use strict'

var fs = require('fs');
var Q = require('q');

var BittrrexDataSource = require('./data/BittrexDataSource');
var PoloniexDataSource = require('./data/PoloniexDataSource');
var CoinbaseDataSource = require('./data/CoinbaseDataSource');
var CurrencyConversionType = require('./data/CurrencyConversion').CurrencyConversionType;
var syscoin = require('syscoin');

var client = new syscoin.Client({
  host: 'localhost',
  port: 8336,
  user: 'username',
  pass: 'password',
  timeout: 30000
});

//holds mock peg data for sync testing
var mockPeg = {
  "rates": [
    {
      "currency": "USD",
      "rate": 2690.1,
      "precision": 2
    }/*,
    {
      "currency": "EUR",
      "rate": 2695.2,
      "precision": 2
    },
    {
      "currency": "GBP",
      "rate": 2697.3,
      "precision": 2
    },
    {
      "currency": "CAD",
      "rate": 2698.0,
      "precision": 2
    },
    {
      "currency": "BTC",
      "rate": 100000.0,
      "precision": 8
    },
    {
      "currency": "SYS",
      "rate": 1.0,
      "precision": 2
     }*/
  ]
};

//holds real peg data
var sysRates;

var config = require('./config');

function PricePeg() {
  this.sysBTCConversionValue = 0;
  this.btcUSDConversionValue = 0;

  this.startTime;
  this.updateHistory = []; //

  this.updateInterval;

  console.log("Starting PricePeg with config:", JSON.stringify(config));

  client.getInfo(function(err, info, resHeaders) {
    if (err) return console.log(err);
    console.log('Syscoin Connection Test. Current Blockheight: ', info.blocks);
  });

  this.startTime = Date.now();

  this.SYSBTCConversionCache = [
    /*new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS"),*/
    new PoloniexDataSource("SYS", "Syscoin", "https://poloniex.com/public?command=returnTicker")
  ];

  this.BTCFiatConversionCache = [
    new CoinbaseDataSource("USD", "US Dollar", "https://coinbase.com/api/v1/currencies/exchange_rates")
  ];

  this.startUpdateInterval();
}

PricePeg.prototype = {
  constructor: PricePeg,

  startUpdateInterval: function () {
    this.refreshCache(true);

    this.updateInterval = setInterval(function () {
      this.refreshCache(true)
    }.bind(this), config.updateInterval * 1000);
  },

  stopUpdateInteval: function () {
    clearInterval(this.updateInterval);
  },

  refreshCache: function (checkForPegUpdate) {
    this.refreshSYSBTCCConversionCache(checkForPegUpdate);
    this.refreshBTCFiatConversionCache(checkForPegUpdate);
  },

  refreshSYSBTCCConversionCache: function (checkForPegUpdate) {
    for(var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      this.SYSBTCConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        this.isCacheRefreshComplete(checkForPegUpdate);
      }.bind(this));
    }
  },

  refreshBTCFiatConversionCache: function (checkForPegUpdate) {
    for (var i = 0; i < this.BTCFiatConversionCache.length; i++) {
      this.BTCFiatConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        this.isCacheRefreshComplete(checkForPegUpdate);
      }.bind(this));
    }
  },

  isCacheRefreshComplete: function (checkForPegUpdate) {
    var allComplete = true;
    for (var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      if (this.SYSBTCConversionCache[i].pendingRequest) {
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
      this.sysBTCConversionValue = this.getSYSBTCAverage();
      this.btcUSDConversionValue = this.getBTCUSDAverage();

      console.log("SYS/BTC: " + this.sysBTCConversionValue);
      console.log("BTC/USD: " + this.btcUSDConversionValue);

      this.getSYSFiatValue(CurrencyConversionType.FIAT.USD);

      if (checkForPegUpdate) {
        this.checkPricePeg();
      }
    }
  },

  checkPricePeg: function () {
    var deferred = Q.defer();

    this.getPricePeg().then(function(currentValue) {

      var newValue = this.convertToPricePeg();

      console.log("NEW: ", JSON.stringify(newValue));
      console.log("OLD: ", JSON.stringify(currentValue));

      var percentChange = 0;
      if (newValue.rates[0].rate != currentValue.rates[0].rate) { //calc % change
        percentChange = ((newValue.rates[0].rate - currentValue.rates[0].rate) / currentValue.rates[0].rate) * 100;
      }

      this.logPegMessage("Checking price. Current v. new = " + currentValue.rates[0].rate + " v. " + newValue.rates[0].rate + " == " + percentChange + "% change");

      percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive

      if (percentChange > (config.updateThresholdPercentage * 100)) {
        this.logPegMessage("Attempting to update price peg.");
        this.setPricePeg(newValue).then(function(result) {
          deferred.resolve(result);
        });
      }else{
        deferred.resolve();
      }

    }.bind(this))

    .catch(function(err) {
      console.log("ERROR:" + err);
      deferred.reject(err);
    }).bind(this);

    return deferred.promise;
  },

  getPricePeg: function () {
    var deferred = Q.defer();

    client.aliasInfo('SYS_RATES', function(err, aliasinfo, resHeaders) {
      if (err) {
        console.log(err);
        deferred.reject(err);
      }

      deferred.resolve(JSON.parse(aliasinfo.value));
    });

    return deferred.promise;
  },

  setPricePeg: function (newValue) {
    var deferred = Q.defer();

    //guard against updating the peg too rapidly
    var now = Date.now();
    var currentInterval = (1000 * 60 * 60 * 24) + (now - this.startTime);
    currentInterval = (currentInterval / (config.updatePeriod * 1000)) % 1; //get remainder of unfinished interval

    //see how many updates have happened in this period
    var currentIntervalStartTime = now - ((config.updatePeriod * 1000) * currentInterval);

    var updatesInThisPeriod = this.updateHistory.filter(function (item) {
      return item > currentIntervalStartTime;
    });

    if (updatesInThisPeriod < config.maxUpdatesPerPeriod) {
      client.aliasUpdate('SYS_RATES', JSON.stringify(newValue), function(err, result, resHeaders) {
        if (err) {
          console.log(err);
          deferred.reject(err);
        }else {
          sysRates = result;
          this.updateHistory.push(Date.now());
          this.logPegMessage("Price peg updated successfully.");
          deferred.resolve(result);
        }
      }.bind(this));
    } else {
      this.logPegMessage("ERROR - Unable to update peg, max updates of [" + config.maxUpdatesPerPeriod + "] would be exceeded. Not updating peg.");
      deferred.reject();
    }

    return deferred.promise;
  },

  convertToPricePeg: function () {
    return {
      rates: [
        {
          currency: CurrencyConversionType.FIAT.USD,
          rate: this.getSYSFiatValue(CurrencyConversionType.FIAT.USD),
          precision: 2
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

  getSYSFiatValue: function(fiatType) {
    var convertedValue;
    switch (fiatType) {
      case "USD":
        convertedValue = 1 / this.btcUSDConversionValue;
        convertedValue = convertedValue / this.sysBTCConversionValue;
        break;
    }

    return convertedValue;
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
