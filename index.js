var BittrexDataSource = require('./lib/data/BittrexDataSource').BittrexDataSource;
var PoloniexDataSource = require('./lib/data/PoloniexDataSource').PoloniexDataSource;
var CryptsyDataSource = require('./lib/data/CryptsyDataSource').CryptsyDataSource;
var CoinbaseDataSource = require('./lib/data/CoinbaseDataSource').CoinbaseDataSource;
var PricePeg = require('./lib/PricePeg').PricePeg;

console.log("runin");

//testing responses
var bittrexSYSData = new BittrexDataSource("https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS");
var poloniexSYSData = new PoloniexDataSource("https://poloniex.com/public?command=returnTicker");
var cryptsySYSData = new CryptsyDataSource("http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=278");
var coinbaseBTCData = new CoinbaseDataSource("https://coinbase.com/api/v1/currencies/exchange_rates");


bittrexSYSData.fetchCurrencyConversionData();
poloniexSYSData.fetchCurrencyConversionData();
cryptsySYSData.fetchCurrencyConversionData();
coinbaseBTCData.fetchCurrencyConversionData();
