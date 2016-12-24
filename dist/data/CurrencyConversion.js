"use strict";
var CurrencyConversion = (function () {
    function CurrencyConversion(fromCurrencySymbol, fromCurrencyLabel, fromCurrencyAmount, toCurrencySymbol, toCurrencyLabel, toCurrencyAmount) {
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = fromCurrencyAmount;
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.toCurrencyAmount = toCurrencyAmount;
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = fromCurrencyAmount;
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.toCurrencyAmount = toCurrencyAmount;
    }
    return CurrencyConversion;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CurrencyConversion;
exports.CurrencyConversionType = {
    FIAT: {
        USD: "USD",
        GBP: "GBP",
        CNY: "CNY",
        EUR: "EUR",
        CAD: "CAD"
    },
    CRYPTO: {
        BTC: "BTC",
        SYS: "SYS",
        ZEC: "ZEC"
    }
};
//# sourceMappingURL=CurrencyConversion.js.map