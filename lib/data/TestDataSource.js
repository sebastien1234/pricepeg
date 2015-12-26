'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;

function TestDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
}

TestDataSource.prototype = new BaseConversionDataSource();
TestDataSource.prototype = {
  constructor: TestDataSource,
  getFormattedCurrencyConversionData: function () {
    console.log("OVERRIDE! " + this.dataUrl);
  }
}

module.exports.TestDataSource = TestDataSource;