'use strict'

function PricePeg(pegVal) {
  this.config = require('./config');
  this.pegStr = pegVal;
}

PricePeg.prototype = {
  constructor: PricePeg,
  testOutput: function () {
    console.log("Testing output:" + this.pegStr + " with an config: " + this.config.maxUpdatesPerPeriod);
  }
}

module.exports.PricePeg = PricePeg;
