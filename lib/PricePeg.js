'use strict'

var fs = require('fs');

var BittrrexDataSource = require('./data/BittrexDataSource');
var PoloniexDataSource = require('./data/PoloniexDataSource');
var CoinbaseDataSource = require('./data/CoinbaseDataSource');
var CurrencyConversionType = require('./data/CurrencyConversion').CurrencyConversionType;

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

var config = require('./config');

function PricePeg() {
  this.sysBTCConversionValue = 0;
  this.btcUSDConversionValue = 0;

  this.updateInterval;

  console.log("Starting PricePeg with config:", JSON.stringify(config));

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
    var currentValue = this.getPricePeg();
    var newValue = this.convertToPricePeg();

    console.log(currentValue.rates[0].rate + ", " + newValue.rates[0].rate);

    var percentChange = 0;
    if (newValue.rates[0].rate != currentValue.rates[0].rate) { //calc % change
      percentChange = ((newValue.rates[0].rate - currentValue.rates[0].rate) / currentValue.rates[0].rate) * 100;
    }

    console.log("Percent change: " + percentChange.toString());

    percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive
    if (percentChange > config.updateThresholdPercentage) {
      console.log("UPDATE PEG!");
      this.setPricePeg(newValue);
    }
  },

  getPricePeg: function () {
    return mockPeg;
  },

  setPricePeg: function (newValue) {
    mockPeg = newValue;
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

        this.logPegMessage("$1 USD is currently worth " + convertedValue);
        break;
    }

    return convertedValue;
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
