'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;
var CurrencyConversion = require('./BaseConversionDataSource').CurrencyConversion;

function BittrexDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  BaseConversionDataSource.call(this, baseCurrencySymbol, baseCurrencyLabel, dataUrl);
}

BittrexDataSource.prototype = new BaseConversionDataSource();
BittrexDataSource.prototype.constructor = BittrexDataSource;
BittrexDataSource.prototype.formatCurrencyConversionData = function (rawCurrencyResponseData) {
  this.formattedCurrencyConversionData = new CurrencyConversion(this.baseCurrencySymbol, this.baseCurrencyLabel, 1, "BTC", "Bitcoin", rawCurrencyResponseData.result.Bid);
}

module.exports.BittrexDataSource = BittrexDataSource;