var PricePeg = require('./lib/PricePeg').PricePeg;
//var TestDataSource = require('./lib/data/TestDataSource').TestDataSource;
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
//var extendData = new TestDataSource("test extend");

//console.log("extended:" + (extendData instanceof TestDataSource))

