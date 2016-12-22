'use strict'

function CurrencyConversion(fromSymbol, fromLabel, fromAmount, toSymbol, toLabel, toAmount) {
  this.fromCurrencySymbol = fromSymbol;
  this.fromCurrencyLabel = fromLabel;
  this.fromCurrencyAmount = fromAmount;
  this.toCurrencySymbol = toSymbol;
  this.toCurrencyLabel = toLabel;
  this.toCurrencyAmount = toAmount;
}

CurrencyConversion.prototype = {
  constructor: CurrencyConversion,

  print: function() {
    console.log(JSON.stringify(this));
  }
};

var CurrencyConversionType = {
  FIAT: {
    USD: "USD",
    GBP: "GBP",
    CNY: "CNY",
    EUR: "EUR",
    CAD: "CAD"
  },
  CRYPTO: {
    BTC: "BTC",
    SYS: "SYS",
    ZEC: "ZEC"
  }
};


module.exports = CurrencyConversion;
module.exports.CurrencyConversionType = CurrencyConversionType;
