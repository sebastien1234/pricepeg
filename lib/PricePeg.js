'use strict'

var BittrrexDataSource = require('./data/BittrexDataSource');
var CoinbaseDataSource = require('./data/CoinbaseDataSource');
var CurrencyConversionType = require('./data/CurrencyConversion').CurrencyConversionType;

function PricePeg() {
  this.config = require('./config');

  this.sysBTCConversionValue = 0;
  this.btcUSDConversionValue = 0;

  console.log("Starting PricePeg with config:", JSON.stringify(this.config));

  this.SYSBTCConversionCache = [
    new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS")
  ];

  this.BTCFiatConversionCache = [
    new CoinbaseDataSource("BTC", "Bitcoin", "https://coinbase.com/api/v1/currencies/exchange_rates")
  ];

  this.refreshCache();
}

PricePeg.prototype = {
  constructor: PricePeg,

  refreshCache: function () {
    this.refreshSYSBTCCConversionCache();
    this.refreshBTCFiatConversionCache();
  },

  refreshSYSBTCCConversionCache: function() {
    for(var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      this.SYSBTCConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        console.log('sys promise completed');
        this.isCacheRefreshComplete();
      }.bind(this));
    }
  },

  refreshBTCFiatConversionCache: function() {
    for (var i = 0; i < this.BTCFiatConversionCache.length; i++) {
      this.BTCFiatConversionCache[i].fetchCurrencyConversionData().then(function (result) {
        console.log('fiat promise completed');
        this.isCacheRefreshComplete();
      }.bind(this));
    }
  },

  isCacheRefreshComplete: function () {
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
    switch (fiatType) {
      case "USD":
        var convertedValue = 1 / this.btcUSDConversionValue;
        convertedValue = convertedValue / this.sysBTCConversionValue;

        console.log("$1 USD is currently worth " + convertedValue)
        break;
    }
  },

  logPegMessage: function(msg) {
    //log a series of mesages around the status of the peg over time to a file
  },

  updatePeg: function() {
    //IF all of the config conditions are met then use getSYSFiatValue(...) across all
    // supported fiat types to create a peg update and execture it against the SYS client
  }
};

module.exports = PricePeg;
