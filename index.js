var BittrexDataSource = require('./lib/data/BittrexDataSource').BittrexDataSource;
var PoloniexDataSource = require('./lib/data/PoloniexDataSource').PoloniexDataSource;
var CryptsyDataSource = require('./lib/data/CryptsyDataSource').CryptsyDataSource;
var CoinbaseDataSource = require('./lib/data/CoinbaseDataSource').CoinbaseDataSource;
var PricePeg = require('./lib/PricePeg').PricePeg;

console.log("runin");

var peg = new PricePeg();

//TODO: this is so hacky, replace with proper promises
setTimeout(function() { peg.getSYSBTCAverage() }, 2000);