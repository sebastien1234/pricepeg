'use strict'

function BaseConversionDataSource(dataUrl) {
  this.dataUrl = dataUrl;
  this.rawCurrencyConversionData;
  this.formattedCurrencyConversionData;
  this.lastFetchTime;
  this.lastSuccessfulFetchTime;
}

BaseConversionDataSource.prototype = {
  constructor: BaseConversionDataSource,
  formatCurrencyConversionData: function (rawCurrencyResponseData) {
    //convert the raw currency conversion data to a standard format, may differ by datasource
  },
  fetchCurrencyConversionData: function () {
    //ajax request to get conversion data, sent to URL
  },
  handleFetchCurrencyConversionDataSuccess: function () {
    //handle response of conversion data ajax request, probably formatCurrencyConversionData(response)
  },
  handleFetchCurrencyConversionDataError: function(error) {
    throw new Error("Problem fetching API data: " + JSON.stringify(error))
  }
}

module.exports.BaseConversionDataSource = BaseConversionDataSource;