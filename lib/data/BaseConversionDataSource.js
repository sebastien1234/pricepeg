'use strict'

var rp = require('request-promise');
var Q = require('q');

function BaseConversionDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  this.dataUrl = dataUrl;
  this.baseCurrencySymbol = baseCurrencySymbol;
  this.baseCurrencyLabel = baseCurrencyLabel;

  this.rawCurrencyConversionData;
  this.formattedCurrencyConversionData; //should always be of type CurrencyConversion for to/from 1
  this.lastFetchAttemptTime = 0;
  this.lastSuccessfulFetchTime = 0;
  this.pendingRequest = false;
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

    this.pendingRequest = true;
    this.lastFetchAttemptTime = Date.now();

    var deferred = Q.defer();

    rp.get({
      uri: this.dataUrl,
      json: true
    }).then(function (parsedBody) {
        this.pendingRequest = false;
        this.handleFetchCurrencyConversionData(parsedBody);
        deferred.resolve();
    }.bind(this))

      .catch(function (err) { // if rp.get rejects (e.g. 500), do this:
        this.pendingRequest = false;
        console.log("Error requesting data.", err);
        deferred.reject(err);
      }.bind(this));

    return deferred.promise;
  },

  handleFetchCurrencyConversionData: function (response) {
    this.rawCurrencyConversionData = response;
    this.lastSuccessfulFetchTime = Date.now();

    console.log(this.dataUrl + " returned: " + JSON.stringify(this.rawCurrencyConversionData));

    this.formatCurrencyConversionData(this.rawCurrencyConversionData);
  }

};

module.exports = BaseConversionDataSource;
