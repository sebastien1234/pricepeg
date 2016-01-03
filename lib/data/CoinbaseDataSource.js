'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;

function CoinbaseDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
  //example response: {"success":true,"message":"","result":{"Bid":0.00000098,"Ask":0.00000099,"Last":0.00000098}}
}

CoinbaseDataSource.prototype = new BaseConversionDataSource();
CoinbaseDataSource.prototype.constructor = CoinbaseDataSource;

module.exports.CoinbaseDataSource = CoinbaseDataSource;