'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;

function BittrexDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
}

BittrexDataSource.prototype = new BaseConversionDataSource();
BittrexDataSource.prototype.constructor = BittrexDataSource;

module.exports.BittrexDataSource = BittrexDataSource;