'use strict'

var rp = require('request-promise');

function BaseConversionDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  if(!dataUrl)
    this.dataUrl = 'http://www.google.com';

  this.dataUrl = dataUrl;
  this.baseCurrencySymbol = baseCurrencySymbol;
  this.baseCurrencyLabel = baseCurrencyLabel;

  this.rawCurrencyConversionData;
  this.formattedCurrencyConversionData; //should always be of type CurrencyConversion for to/from 1
  this.lastFetchAttemptTime;
  this.lastSuccessfulFetchTime;
}

BaseConversionDataSource.prototype = {
  constructor: BaseConversionDataSource,

  formatCurrencyConversionData: function (rawCurrencyResponseData) {
    //convert the raw currency conversion data to a standard format, may differ by datasource
    console.log("Handling response in base data source handler.");

    return null; //this should be overridden!
  },

  fetchCurrencyConversionData: function () {
    //ajax request to get conversion data, sent to URL
    console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);

    this.lastFetchAttemptTime = Date.now();

    rp.get({ // start an async call and return a promise
      uri: this.dataUrl,
      json: true
    }).then(function(parsedBody){ // if rp.get resolves, push res.data
        this.handleFetchCurrencyConversionData(parsedBody);
    }.bind(this))
      .catch(function(err){ // if rp.get rejects (e.g. 500), do this:
        console.log("Error requesting data.", err);
      });
  },

  handleFetchCurrencyConversionData: function (response) {
    //handle response of conversion data ajax request, probably formatCurrencyConversionData(response)
    console.log("results:", response);
    console.log(this.dataUrl +" returned. \n");

    this.rawCurrencyConversionData = response;
    this.lastSuccessfulFetchTime = Date.now();

    this.formatCurrencyConversionData(this.rawCurrencyConversionData);
  }
}

module.exports = BaseConversionDataSource;
