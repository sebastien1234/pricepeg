'use strict'

var request = require('request');

function BaseConversionDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl) {
  if(!dataUrl)
    this.dataUrl = 'http://www.google.com';

  this.dataUrl = dataUrl;
  this.baseCurrencySymbol = baseCurrencyLabel;
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
    return null; //this should be overridden!
  },
  fetchCurrencyConversionData: function () {
    //ajax request to get conversion data, sent to URL
    console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);

    this.lastFetchAttemptTime = Date.now();

    //TODO: convert this to return a promise
    request.apply(this, [this.dataUrl, this.handleFetchCurrencyConversionData]);
  },
  handleFetchCurrencyConversionData: function (error, response, body) {
    //handle response of conversion data ajax request, probably formatCurrencyConversionData(response)
    if (!error && response.statusCode == 200) {
      console.log(this.dataUrl +" returned. \n");

      this.rawCurrencyConversionData = body;
      this.lastSuccessfulFetchTime = Date.now();

      this.formatCurrencyConversionData(this.rawCurrencyConversionData);
    }else{
      throw new Error("Problem fetching API data from: " + this.dataUrl + " response: " + JSON.stringify(error));
    }
  }
}

function CurrencyConversion(fromSymbol, fromLabel, fromAmount, toSymbol, toLabel, toAmount) {
  this.fromCurrencySymbol = fromSymbol;
  this.fromCurrencyLabel = fromLabel;
  this.fromCurrencyAmount = fromAmount;
  this.toCurrencySymbol = toSymbol;
  this.toCurrencyLabel = toLabel;
  this.toCurrencyAmount = toAmount;
}

CurrencyConversion.prototype.constructor = CurrencyConversion;

module.exports.BaseConversionDataSource = BaseConversionDataSource;
module.exports.CurrencyConversion = CurrencyConversion;