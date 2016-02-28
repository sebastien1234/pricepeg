const util = require('util');
const PricePeg = require('./PricePeg');

var PricePegSub = function PricePegSub(){
  PricePeg.call(this);
  console.log("Peg Sub");
}

util.inherits(PricePegSub, PricePeg);

PricePegSub.prototype.hello = function () {
  console.log("hello from SUB");
}

module.exports = PricePegSub;

