"use strict";
var Utils_1 = require("./Utils");
var rp = require("request-promise");
var Q = require("q");
var config_1 = require("../config");
var BaseConversionDataSource = (function () {
    function BaseConversionDataSource(baseCurrencySymbol, baseCurrencyLabel, dataUrl, responseDataPath) {
        if (responseDataPath === void 0) { responseDataPath = null; }
        var _this = this;
        this.baseCurrencySymbol = baseCurrencySymbol;
        this.baseCurrencyLabel = baseCurrencyLabel;
        this.dataUrl = dataUrl;
        this.responseDataPath = responseDataPath;
        this.lastFetchAttemptTime = 0;
        this.lastSuccessfulFetchTime = 0;
        this.formatCurrencyConversionData = function (rawCurrencyResponseData) {
            //convert the raw currency conversion data to a standard format, may differ by datasource
            if (config_1.getConfig().logLevel.logNetworkEvents)
                Utils_1.logPegMessage("Handling response in base data source handler.");
            return null; //this should be overridden!
        };
        this.fetchCurrencyConversionData = function () {
            //console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);
            _this.lastFetchAttemptTime = Date.now();
            var deferred = Q.defer();
            rp.get({
                uri: _this.dataUrl,
                json: true
            }).then(function (parsedBody) {
                _this.handleFetchCurrencyConversionData(parsedBody);
                deferred.resolve();
            })
                .catch(function (err) {
                Utils_1.logPegMessage("Error requesting data for " + _this.dataUrl + " ,err: " + JSON.stringify(err));
                deferred.reject("Error requesting data for " + _this.dataUrl + " ,err: " + JSON.stringify(err));
            });
            return deferred.promise;
        };
        this.handleFetchCurrencyConversionData = function (response) {
            _this.rawCurrencyConversionData = response;
            _this.lastSuccessfulFetchTime = Date.now();
            if (config_1.getConfig().logLevel.logNetworkEvents)
                Utils_1.logPegMessage(_this.dataUrl + " returned!");
            _this.formatCurrencyConversionData(_this.rawCurrencyConversionData);
        };
        this.dataUrl = dataUrl;
        this.baseCurrencySymbol = baseCurrencySymbol;
        this.baseCurrencyLabel = baseCurrencyLabel;
        this.responseDataPath = responseDataPath;
    }
    return BaseConversionDataSource;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseConversionDataSource;
//# sourceMappingURL=BaseConversionDataSource.js.map