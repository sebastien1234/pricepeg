'use strict'

var util = require('util');

var BaseConversionDataSource = require('./BaseConversionDataSource');
var CurrencyConversion = require('./CurrencyConversion');

function BittrexDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  BaseConversionDataSource.call(this, baseCurrencySymbol, baseCurrencyLabel, dataUrl);
  util.inherits(BittrexDataSource, BaseConversionDataSource);
}

BittrexDataSource.prototype = {
  constructor: BittrexDataSource,

  formatCurrencyConversionData : function(rawCurrencyResponseData) {
    console.log("Handling response in bittrex handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.result.Bid);
    this.formattedCurrencyConversionData.print();
  }
}


module.exports = BittrexDataSource;