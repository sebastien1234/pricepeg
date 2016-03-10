'use strict'

var fs = require('fs');

var BittrrexDataSource = require('./data/BittrexDataSource');
var CoinbaseDataSource = require('./data/CoinbaseDataSource');
var CurrencyConversionType = require('./data/CurrencyConversion').CurrencyConversionType;

var mockPeg = {
  "rates": [
    {
      "currency": "USD",
      "rate": 2690.1,
      "precision": 2
    },
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
    }
  ]
};

function PricePeg() {
  this.config = require('./config');

  this.sysBTCConversionValue = 0;
  this.btcUSDConversionValue = 0;

  this.updateInterval;

  console.log("Starting PricePeg with config:", JSON.stringify(this.config));

  this.SYSBTCConversionCache = [
    new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS")
  ];

  this.BTCFiatConversionCache = [
    new CoinbaseDataSource("USD", "US Dollar", "https://coinbase.com/api/v1/currencies/exchange_rates")
  ];

  this.refreshCache();
}

PricePeg.prototype = {
  constructor: PricePeg,

  startUpdateInterval: function () {
    this.updateInterval = setInterval(config.updateInterval, this.refreshCache, true);
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
        console.log('sys promise completed');
        this.isCacheRefreshComplete(checkForPegUpdate);
      }.bind(this));
    }
  },

  refreshBTCFiatConversionCache: function (checkForPegUpdate) {
    for (var i = 0; i < this.BTCFiatConversionCache.length; i++) {
      this.BTCFiatConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        console.log('fiat promise completed');
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
      console.log("all complete.");
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
    var currentValue = this.getPricePeg();
    var newValue = this.convertToPricePeg(/* current value of sys */);

    //calc the % diff
    //if the diff is > config.threshold, else log
    //if the num of updates in this period < config.maxUpdatesPerPeriod, else log
    //attempt to update the peg, log the event
  },

  getPricePeg: function () {
    return mockPeg;
  },

  setPricePeg: function (newValue) {
    mockPeg = newValue;
  },

  convertToPricePeg: function (sysBTC, btcUSD) {
    /* takes an exchange rate and converts it into the same format as expressed by the rates alias */
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
    switch (fiatType) {
      case "USD":
        var convertedValue = 1 / this.btcUSDConversionValue;
        convertedValue = convertedValue / this.sysBTCConversionValue;

        this.logPegMessage("$1 USD is currently worth " + convertedValue);
        break;
    }
  },

  logPegMessage: function(msg) {
    //log a series of mesages around the status of the peg over time to a file
    fs.appendFile("./peg.log", msg + "\n", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }
};

module.exports = PricePeg;
