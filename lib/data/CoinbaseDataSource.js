'use strict'

var util = require('util');

var BaseConversionDataSource = require('./BaseConversionDataSource');
var CurrencyConversion = require('./CurrencyConversion');

function CoinbaseDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  BaseConversionDataSource.call(this, baseCurrencySymbol, baseCurrencyLabel, dataUrl);
  util.inherits(CoinbaseDataSource, BaseConversionDataSource);
}

CoinbaseDataSource.prototype = {
  constructor: CoinbaseDataSource,

  formatCurrencyConversionData: function (rawCurrencyResponseData) {
    //console.log("Handling response in coinbase handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.btc_to_usd);
  }
};


module.exports = CoinbaseDataSource;
;