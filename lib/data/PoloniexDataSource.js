'use strict'

var util = require('util');

var BaseConversionDataSource = require('./BaseConversionDataSource');
var CurrencyConversion = require('./CurrencyConversion');

function PoloniexDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  BaseConversionDataSource.call(this, baseCurrencySymbol, baseCurrencyLabel, dataUrl);
  util.inherits(PoloniexDataSource, BaseConversionDataSource);
}

PoloniexDataSource.prototype = {
  constructor: PoloniexDataSource,

  formatCurrencyConversionData: function (rawCurrencyResponseData) {
    //console.log("Handling response in poloniex handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.BTC_SYS.last);
  }
};


module.exports = PoloniexDataSource;