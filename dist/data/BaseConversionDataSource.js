"use strict";
var rp = require('request-promise');
var Q = require('q');
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
        this.pendingRequest = false;
        this.formatCurrencyConversionData = function (rawCurrencyResponseData) {
            //convert the raw currency conversion data to a standard format, may differ by datasource
            console.log("Handling response in base data source handler.");
            return null; //this should be overridden!
        };
        this.fetchCurrencyConversionData = function () {
            //console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);
            _this.pendingRequest = true;
            _this.lastFetchAttemptTime = Date.now();
            var deferred = Q.defer();
            rp.get({
                uri: _this.dataUrl,
                json: true
            }).then(function (parsedBody) {
                _this.pendingRequest = false;
                _this.handleFetchCurrencyConversionData(parsedBody);
                deferred.resolve();
            })
                .catch(function (err) {
                _this.pendingRequest = false;
                console.log("Error requesting data.", err);
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.handleFetchCurrencyConversionData = function (response) {
            _this.rawCurrencyConversionData = response;
            _this.lastSuccessfulFetchTime = Date.now();
            //console.log(this.dataUrl + " returned: " + JSON.stringify(this.rawCurrencyConversionData));
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