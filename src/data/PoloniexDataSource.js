'use strict'

var util = require('util');
var getDeepValue = require('./Utils');

var BaseConversionDataSource = require('./BaseConversionDataSource');
var CurrencyConversion = require('./CurrencyConversion');

function PoloniexDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl, responseDataPath) {
  BaseConversionDataSource.call(this, baseCurrencySymbol, baseCurrencyLabel, dataUrl, responseDataPath);
  util.inherits(PoloniexDataSource, BaseConversionDataSource);
}

PoloniexDataSource.prototype = {
  constructor: PoloniexDataSource,

  formatCurrencyConversionData: function (rawCurrencyResponseData) {
    //console.log("Handling response in poloniex handler.");
    this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", getDeepValue(rawCurrencyResponseData, this.responseDataPath));
  }
};


module.exports = PoloniexDataSource;