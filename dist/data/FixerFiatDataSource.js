"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseConversionDataSource_1 = require("./BaseConversionDataSource");
var FixerFiatDataSource = (function (_super) {
    __extends(FixerFiatDataSource, _super);
    function FixerFiatDataSource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatCurrencyConversionData = function (rawCurrencyResponseData) {
            //rather than returning an CurrencyConversion object this returns an object that has properties for each of the fiat
            //currencies.
            _this.formattedCurrencyConversionData = {
                AUD: rawCurrencyResponseData.rates.AUD,
                BGN: rawCurrencyResponseData.rates.BGN,
                BRL: rawCurrencyResponseData.rates.BRL,
                CAD: rawCurrencyResponseData.rates.CAD,
                CHF: rawCurrencyResponseData.rates.CHF,
                CNY: rawCurrencyResponseData.rates.CNY,
                CZK: rawCurrencyResponseData.rates.CZK,
                DKK: rawCurrencyResponseData.rates.DKK,
                EUR: rawCurrencyResponseData.rates.EUR,
                GBP: rawCurrencyResponseData.rates.GBP,
                HKD: rawCurrencyResponseData.rates.HKD,
                HRK: rawCurrencyResponseData.rates.HRK,
                HUF: rawCurrencyResponseData.rates.HUF,
                IDR: rawCurrencyResponseData.rates.IDR,
                ILS: rawCurrencyResponseData.rates.ILS,
                INR: rawCurrencyResponseData.rates.INR,
                JPY: rawCurrencyResponseData.rates.JPY,
                KRW: rawCurrencyResponseData.rates.KRW,
                MXN: rawCurrencyResponseData.rates.MXN,
                MYR: rawCurrencyResponseData.rates.MYR,
                NOK: rawCurrencyResponseData.rates.NOK,
                NZD: rawCurrencyResponseData.rates.NZD,
                PHP: rawCurrencyResponseData.rates.PHP,
                PLN: rawCurrencyResponseData.rates.PLN,
                RON: rawCurrencyResponseData.rates.RON,
                RUB: rawCurrencyResponseData.rates.RUB,
                SEK: rawCurrencyResponseData.rates.SEK,
                SGD: rawCurrencyResponseData.rates.SGD,
                THB: rawCurrencyResponseData.rates.THB,
                TRY: rawCurrencyResponseData.rates.TRY,
                ZAR: rawCurrencyResponseData.rates.ZAR
            };
        };
        return _this;
    }
    return FixerFiatDataSource;
}(BaseConversionDataSource_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FixerFiatDataSource;
//# sourceMappingURL=FixerFiatDataSource.js.map