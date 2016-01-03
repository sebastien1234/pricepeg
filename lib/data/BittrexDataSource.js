'use strict'

var BaseConversionDataSource = require('./BaseConversionDataSource').BaseConversionDataSource;
//var sampleData = require('./sample');

function BittrexDataSource(dataUrl) {
  BaseConversionDataSource.call(this, dataUrl);
}

BittrexDataSource.prototype = new BaseConversionDataSource();
BittrexDataSource.prototype = {
  constructor: BittrexDataSource
};

module.exports.BittrexDataSource = BittrexDataSource;