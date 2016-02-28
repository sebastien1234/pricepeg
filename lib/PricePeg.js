'use strict'

var BittrrexDataSource = require('./data/BittrexDataSource');

function PricePeg() {
  this.config = require('./config');

  console.log("Starting PricePeg with config:", JSON.stringify(this.config));

  this.SYSBTCConversionCache = [
    new BittrrexDataSource("SYS", "Syscoin", "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS")
  ];

  this.BTCFiatConversionCache = [];

  this.refreshSYSBTCCConversionCache();
}

PricePeg.prototype = {
  constructor: PricePeg,

  refreshSYSBTCCConversionCache: function() {
    for(var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      this.SYSBTCConversionCache[i].fetchCurrencyConversionData();
    }
  },

  refreshBTCFiatConversionCache: function() {
    //same thing as with alt coins but BTC->USD etc type conversion
  },

  getSYSBTCAverage: function(amount) {
    //first get the average across all the conversions
    var avgSum = 0;
    for(var i = 0; i < this.SYSBTCConversionCache.length; i++) {
      avgSum += this.SYSBTCConversionCache[i].formattedCurrencyConversionData.toCurrencyAmount;
    }

    var avgVal = avgSum / this.SYSBTCConversionCache.length;

    if(!amount)
      amount = 1;

    return avgVal * amount;
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

module.exports = PricePeg;
