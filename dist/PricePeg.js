"use strict";
var Utils_1 = require("./data/Utils");
var FixerFiatDataSource_1 = require("./data/FixerFiatDataSource");
var CurrencyConversion_1 = require("./data/CurrencyConversion");
var CryptoConverter_1 = require("./data/CryptoConverter");
var Q = require("q");
var common_1 = require("./common");
var ConversionDataSource_1 = require("./data/ConversionDataSource");
var PoloniexDataSource_1 = require("./data/PoloniexDataSource");
var config_1 = require("./config");
var syscoin = require('syscoin');
var config = config_1.getConfig();
var client = new syscoin.Client({
    host: config.rpcserver,
    port: config.rpcport,
    user: config.rpcuser,
    pass: config.rpcpassword,
    timeout: config.rpctimeout
});
exports.conversionKeys = {
    BTCUSD: CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.symbol + CurrencyConversion_1.CurrencyConversionType.FIAT.USD.symbol,
    SYSBTC: CurrencyConversion_1.CurrencyConversionType.CRYPTO.SYS.symbol + CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.symbol
};
var PricePeg = (function () {
    function PricePeg(configuredDataProvider) {
        var _this = this;
        this.configuredDataProvider = configuredDataProvider;
        this.startTime = null;
        this.updateHistory = [];
        this.sysRates = null;
        this.updateInterval = null;
        this.fiatDataSource = new FixerFiatDataSource_1.default("USD", "US Dollar", "http://api.fixer.io/latest?base=USD"); //used to extrapolate other Fiat/SYS pairs off SYS/USD
        this.conversionDataSources = [];
        this.start = function () {
            Utils_1.logPegMessage("Starting PricePeg with config:\n                    " + JSON.stringify(config));
            if (config.enableLivePegUpdates)
                client.getInfo(function (err, info, resHeaders) {
                    if (err) {
                        return Utils_1.logPegMessage("Error: " + err);
                    }
                    Utils_1.logPegMessage("Syscoin Connection Test. Current Blockheight: " + info.blocks);
                });
            _this.startTime = Date.now();
            //try to load up any previous data
            _this.loadUpdateHistory().then(function (log) {
                var parseLog = JSON.parse(log);
                if (Utils_1.validateUpdateHistoryLogFormat(parseLog)) {
                    if (config.logLevel.logUpdateLoggingEvents)
                        Utils_1.logPegMessage("Peg update history loaded from file and validated.");
                    _this.updateHistory = parseLog;
                }
                else {
                    if (config.logLevel.logUpdateLoggingEvents)
                        Utils_1.logPegMessage("Peg update history loaded from file but was INVALID!");
                }
                _this.startUpdateInterval();
            }, function (err) {
                _this.startUpdateInterval();
            });
        };
        this.stop = function () {
            _this.stopUpdateInterval();
        };
        this.startUpdateInterval = function () {
            _this.fiatDataSource.fetchCurrencyConversionData().then(function (result) {
                if (!config.enablePegUpdateDebug) {
                    _this.refreshCurrentRates(true);
                    _this.updateInterval = setInterval(function () {
                        _this.refreshCurrentRates(true);
                    }, config.updateInterval * 1000);
                }
                else {
                    _this.checkPricePeg();
                    _this.updateInterval = setInterval(function () {
                        _this.checkPricePeg();
                    }, config.debugPegUpdateInterval * 1000);
                }
            });
        };
        this.stopUpdateInterval = function () {
            clearInterval(_this.updateInterval);
        };
        this.refreshCurrentRates = function (checkForPegUpdate) {
            var dataSources = [];
            for (var key in _this.conversionDataSources) {
                dataSources.push(_this.conversionDataSources[key].refreshAverageExchangeRate());
            }
            Q.all(dataSources).then(function (resultsArr) {
                _this.handleCurrentRateRefreshComplete(checkForPegUpdate);
            });
        };
        this.handleCurrentRateRefreshComplete = function (checkForPegUpdate) {
            if (config.logLevel.logNetworkEvents) {
                //any time we fetch crypto rates, fetch the fiat rates too
                Utils_1.logPegMessage("Exchange rate refresh complete, check for peg value changes == " + checkForPegUpdate);
                Utils_1.logPegMessageNewline();
            }
            if (checkForPegUpdate) {
                _this.checkPricePeg();
            }
        };
        this.loadUpdateHistory = function () {
            var deferred = Q.defer();
            Utils_1.readFromFile(config.updateLogFilename).then(function (log) {
                deferred.resolve(log);
            }, function (e) { return deferred.reject(e); });
            return deferred.promise;
        };
        this.getRate = function (ratesObject, searchSymbol) {
            var rate = 0;
            for (var i = 0; i < ratesObject.rates.length; i++) {
                var rateObj = ratesObject.rates[i];
                if (rateObj.currency == searchSymbol)
                    rate = rateObj.rate;
            }
            return rate;
        };
        this.checkPricePeg = function () {
            var deferred = Q.defer();
            _this.getPricePeg().then(function (currentValue) {
                if (config.logLevel.logPriceCheckEvents)
                    Utils_1.logPegMessage("Current peg value: " + JSON.stringify(currentValue));
                if (_this.sysRates == null) {
                    if (config.logLevel.logPriceCheckEvents)
                        Utils_1.logPegMessage("No current value set, setting, setting first result as current value.");
                    _this.sysRates = currentValue;
                }
                if (config.logLevel.logPriceCheckEvents)
                    Utils_1.logPegMessageNewline();
                var newValue = _this.convertToPricePeg();
                if (config.enablePegUpdateDebug) {
                    _this.setPricePeg(newValue, currentValue);
                }
                else {
                    for (var key in _this.conversionDataSources) {
                        if (_this.conversionDataSources[key].currencyConfig != null) {
                            var currencyKey = _this.conversionDataSources[key].getPegCurrency();
                            var currentConversionRate = _this.getRate(currentValue, currencyKey);
                            var newConversionRate = _this.getRate(newValue, currencyKey);
                            var rateExists = true;
                            try {
                                if (currentConversionRate == null || newConversionRate == null) {
                                    rateExists = false;
                                    throw new Error("No such rate: " + currencyKey);
                                }
                                var percentChange = Utils_1.getPercentChange(newConversionRate, currentConversionRate);
                                if (config.logLevel.logPriceCheckEvents) {
                                    Utils_1.logPegMessage("Checking price for " + currencyKey + ": Current v. new = " + currentConversionRate + "  v. " + newConversionRate + " == " + percentChange + "% change");
                                }
                                percentChange = percentChange < 0 ? percentChange * -1 : percentChange; //convert neg percent to positive
                                //if the price for any single currency as moved outside of the config'd range or the rate doesn't yet exist, update the peg.
                                if (percentChange > (config.updateThresholdPercentage * 100)) {
                                    if (config.logLevel.logBlockchainEvents)
                                        Utils_1.logPegMessage("Attempting to update price peg, currency " + currencyKey + " changed by " + percentChange + ".");
                                    _this.setPricePeg(newValue, currentValue).then(function (result) {
                                        deferred.resolve(result);
                                    });
                                }
                                else {
                                    deferred.resolve();
                                }
                            }
                            catch (e) {
                                if (!rateExists) {
                                    if (config.logLevel.logBlockchainEvents)
                                        Utils_1.logPegMessage("Attempting to update price peg because new rate set doesn't match current");
                                    //find the new entries and update them
                                    for (var i = 0; i < newValue.rates.length; i++) {
                                        if (newValue.rates[i].rate == null || isNaN(newValue.rates[i].rate)) {
                                            newValue.rates[i].rate = 0;
                                        }
                                    }
                                    _this.setPricePeg(newValue, currentValue).then(function (result) {
                                        deferred.resolve(result);
                                    });
                                }
                            }
                        }
                    }
                }
            })
                .catch(function (err) {
                Utils_1.logPegMessage("ERROR:" + err);
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getPricePeg = function () {
            var deferred = Q.defer();
            if (!config.enableLivePegUpdates) {
                deferred.resolve(common_1.mockPeg);
            }
            else {
                client.aliasInfo(config.pegalias, function (err, aliasinfo, resHeaders) {
                    if (err) {
                        Utils_1.logPegMessage("Error: " + err);
                        return deferred.reject(err);
                    }
                    deferred.resolve(JSON.parse(aliasinfo.value));
                });
            }
            return deferred.promise;
        };
        this.setPricePeg = function (newValue, oldValue) {
            var deferred = Q.defer();
            //guard against updating the peg too rapidly
            var now = Date.now();
            var currentInterval = (1000 * 60 * 60 * 24) + (now - _this.startTime);
            currentInterval = (currentInterval / (config.updatePeriod * 1000)) % 1; //get remainder of unfinished interval
            //see how many updates have happened in this period
            var currentIntervalStartTime = now - ((config.updatePeriod * 1000) * currentInterval);
            var updatesInThisPeriod = 0;
            if (config.logLevel.logBlockchainEvents)
                Utils_1.logPegMessage("Attempting to update price peg if within safe parameters.");
            updatesInThisPeriod += _this.updateHistory.filter(function (item) {
                return item.date > currentIntervalStartTime;
            }).length;
            if (updatesInThisPeriod <= config.maxUpdatesPerPeriod) {
                if (config.enableLivePegUpdates) {
                    client.aliasUpdate(config.pegalias, config.pegalias_aliaspeg, JSON.stringify(newValue), function (err, result, resHeaders) {
                        if (err) {
                            Utils_1.logPegMessage("ERROR: " + err);
                            Utils_1.logPegMessageNewline();
                            deferred.reject(err);
                        }
                        else {
                            _this.logUpdate(newValue, oldValue); //always store the pre-update value so it makes sense when displayed
                            deferred.resolve(result);
                        }
                    });
                }
                else {
                    _this.logUpdate(newValue, oldValue);
                    deferred.resolve(newValue);
                }
            }
            else {
                Utils_1.logPegMessage("ERROR - Unable to update peg, max updates of [" + config.maxUpdatesPerPeriod + "] would be exceeded. Not updating peg.");
                Utils_1.logPegMessageNewline();
                deferred.reject(null);
            }
            return deferred.promise;
        };
        this.logUpdate = function (newValue, oldValue) {
            //store prev value
            _this.updateHistory.push({
                date: Date.now(),
                value: oldValue
            });
            //write updated history object to file
            Utils_1.writeToFile(config.updateLogFilename, JSON.stringify(_this.updateHistory), false).then(function (result) {
                if (config.logLevel.logUpdateLoggingEvents)
                    Utils_1.logPegMessage("Update log history written to successfully");
            });
            _this.sysRates = newValue;
            if (config.logLevel.logBlockchainEvents) {
                Utils_1.logPegMessage("Price peg updated successfully.");
                Utils_1.logPegMessageNewline();
            }
        };
        this.convertToPricePeg = function () {
            var peg = {
                rates: []
            };
            for (var key in _this.conversionDataSources) {
                if (_this.conversionDataSources[key].currencyConfig != null) {
                    peg.rates.push(_this.conversionDataSources[key].getSYSPegFormat(_this.conversionDataSources, _this.fiatDataSource));
                }
            }
            return peg;
        };
        if (!config.enableLivePegUpdates) {
            this.fiatDataSource.formattedCurrencyConversionData = common_1.mockPeg;
        }
        //setup conversions for currencies this peg will support
        //CryptoConverter should only be used for exchanges which there is a direct API for, anything
        //further conversions should happen in subclasses or this class
        var conversion = null;
        var btcUSDExists = false;
        var sysBTCExists = false;
        if (configuredDataProvider != null) {
            for (var i = 0; i < configuredDataProvider.length; i++) {
                this.conversionDataSources[configuredDataProvider[i].key] = configuredDataProvider[i];
                if (configuredDataProvider[i].key == exports.conversionKeys.BTCUSD) {
                    btcUSDExists = true;
                }
                if (configuredDataProvider[i].key == exports.conversionKeys.SYSBTC) {
                    sysBTCExists = true;
                }
            }
        }
        if (!btcUSDExists) {
            var conversion_1 = new CurrencyConversion_1.default(CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.label, 1, CurrencyConversion_1.CurrencyConversionType.FIAT.USD.symbol, CurrencyConversion_1.CurrencyConversionType.FIAT.USD.label, 1);
            this.conversionDataSources[exports.conversionKeys.BTCUSD] = new CryptoConverter_1.default(conversion_1, [new ConversionDataSource_1.default(conversion_1, "https://coinbase.com/api/v1/currencies/exchange_rates", "btc_to_usd")], null);
        }
        if (!sysBTCExists) {
            conversion = new CurrencyConversion_1.default(CurrencyConversion_1.CurrencyConversionType.CRYPTO.SYS.symbol, CurrencyConversion_1.CurrencyConversionType.CRYPTO.SYS.label, 1, CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversion_1.CurrencyConversionType.CRYPTO.BTC.label, 1);
            this.conversionDataSources[exports.conversionKeys.SYSBTC] = new CryptoConverter_1.default(conversion, [new ConversionDataSource_1.default(conversion, "https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS", "result.Bid"),
                new PoloniexDataSource_1.default(conversion, "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_SYS&depth=1", "bids")], null);
        }
    }
    return PricePeg;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PricePeg;
;
