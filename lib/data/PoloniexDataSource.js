'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;

function PoloniexDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
  //example response: {"success":true,"message":"","result":{"Bid":0.00000098,"Ask":0.00000099,"Last":0.00000098}}
}

PoloniexDataSource.prototype = new BaseConversionDataSource();
PoloniexDataSource.prototype.constructor = PoloniexDataSource;

module.exports.PoloniexDataSource = PoloniexDataSource;