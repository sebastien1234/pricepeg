'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;

function CryptsyDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
  //example response: {"success":true,"message":"","result":{"Bid":0.00000098,"Ask":0.00000099,"Last":0.00000098}}
}

CryptsyDataSource.prototype = new BaseConversionDataSource();
CryptsyDataSource.prototype.constructor = CryptsyDataSource;

module.exports.CryptsyDataSource = CryptsyDataSource;