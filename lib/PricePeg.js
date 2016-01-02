'use strict'

var BittrrexDataSource = require('./BittrexDataSource').BittrexDataSource;

function PricePeg(pegVal) {
  this.config = require('./config');
  this.pegStr = pegVal;

  this.altCoinCurrencyConversions = [];
  this.btcFiatCurrencyConversions = [];

  this.altCoinCurrencyConversionDataSources = [
    new BittrrexDataSource("https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS")
  ]
}

PricePeg.prototype = {
  constructor: PricePeg,
  testOutput: function () {
    console.log("Testing output:" + this.pegStr + " with an config: " + this.config.maxUpdatesPerPeriod);
  },
  refreshAltCoinCurrencyConversionCache: function() {
    for(var i = 0; i < this.altCoinCurrencyConversionDataSources.length; i++) {
      this.altCoinCurrencyConversionDataSources[i].fetchCurrencyConversionData().then(function(formttedCurrencyConversionData) {
        this.altCoinCurrencyConversions.push(formttedCurrencyConversionData);
      })
    }
  },
  refreshBTCFiatCurrencyConversionCache: function() {
    //same thing as with alt coins but BTC->USD etc type conversion
  },
  getAltCoinAverageCurrencyConversion: function() {
    //get the average currency conversion
  },
  getBTCFiatAverageCurrencyConversion: function(fiatType) {
    //get the average btc to fiat conversion
  },
  lookupBTCFiatConversion: function(fiatType) {
    //return the BTC conversion for a specific type of fiat, will support multiple
  },
  getSYSFiatValue: function(fiatType) {
    //after averaging alt conversions and fiat conversions, returns the final currency peg based valye of 1 SYS in fiatType
  },
  logPegMessage: function(msg) {
    //log a series of mesages around the status of the peg over time to a file
  },
  updatePeg: function() {
    //IF all of the config conditions are met then use getSYSFiatValue(...) across all
    // supported fiat types to create a peg update and execture it against the SYS client
  }
};

module.exports.PricePeg = PricePeg;
