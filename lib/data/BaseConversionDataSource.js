'use strict'

var request = require('request');

function BaseConversionDataSource(dataUrl) {
  if(!dataUrl)
    this.dataUrl = 'http://www.google.com';

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
    console.log("Fetching currency data from: " + this.dataUrl);
    var self = this;
    request(this.dataUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(self.dataUrl + " = " + body + "\n\n\n") // Show the HTML for the Google homepage.
      }
    })
  },
  handleFetchCurrencyConversionDataSuccess: function () {
    //handle response of conversion data ajax request, probably formatCurrencyConversionData(response)
  },
  handleFetchCurrencyConversionDataError: function(error) {
    throw new Error("Problem fetching API data: " + JSON.stringify(error))
  }
}

module.exports.BaseConversionDataSource = BaseConversionDataSource;