'use strict'

function PricePeg(pegVal) {
  var config = require('./config');

  function testOutput() {
    console.log("Testing output:" + this.peg + " with an config: " + config.maxUpdatesPerPeriod);
  }

  return {
    peg: pegVal,
    testOutput: testOutput
  }

}

module.exports.PricePeg = PricePeg;
