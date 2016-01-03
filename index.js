var PricePeg = require('./lib/PricePeg').PricePeg;
var BittrexDataSource = require('./lib/data/BittrexDataSource').BittrexDataSource;
var BaseConversionDataSource = require('./lib/data/BaseConversionDataSource').BaseConversionDataSource;


console.log("runin");
var peg1 = new PricePeg("peg1");
var peg2 = new PricePeg("peg2");

peg1.testOutput();
peg2.testOutput();

peg1.pegStr = "changed";

peg1.testOutput();

//test inheritance assumptions
var baseData = new BaseConversionDataSource("test base");
var bittrexData = new BittrexDataSource("https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS");

baseData.fetchCurrencyConversionData("");
console.log("BREAK");
bittrexData.fetchCurrencyConversionData();
