'use strict'

function BaseConversionDataSource(dataUrl) {
  this.dataUrl = dataUrl;
  this.rawConversionData;
  this.formattedConversionData;

  this.getFormattedCurrencyConversionData();
}

BaseConversionDataSource.prototype = {
  constructor: BaseConversionDataSource,
  _formatCurrencyConversionData: function (rawData) {
    //stub
  },
  fetchCurrencyConversionData: function () {
    var rawData
    _formatCurrencyConversionData(rawData)
  },
  getFormattedCurrencyConversionData: function () {
    console.log("Formatted base data:" + this.dataUrl);
  }
}

module.exports.BaseConversionDataSource = BaseConversionDataSource;