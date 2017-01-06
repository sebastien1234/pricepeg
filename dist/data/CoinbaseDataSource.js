"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseConversionDataSource_1 = require("./BaseConversionDataSource");
var CurrencyConversion_1 = require("./CurrencyConversion");
var CurrencyConversion_2 = require("./CurrencyConversion");
var CoinbaseDataSource = (function (_super) {
    __extends(CoinbaseDataSource, _super);
    function CoinbaseDataSource() {
        var _this = _super.apply(this, arguments) || this;
        _this.formatCurrencyConversionData = function (rawCurrencyResponseData) {
            //console.log("Handling response in coinbase handler.", rawCurrencyResponseData.btc_to_usd);
            _this.formattedCurrencyConversionData = new CurrencyConversion_1.default(_this.baseCurrencySymbol, _this.baseCurrencyLabel, 1, CurrencyConversion_2.CurrencyConversionType.CRYPTO.BTC.symbol, CurrencyConversion_2.CurrencyConversionType.CRYPTO.BTC.label, rawCurrencyResponseData.btc_to_usd);
        };
        return _this;
    }
    return CoinbaseDataSource;
}(BaseConversionDataSource_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoinbaseDataSource;
;
