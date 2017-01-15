"use strict";
var CurrencyConversion = (function () {
    function CurrencyConversion(fromCurrencySymbol, fromCurrencyLabel, fromCurrencyAmount, toCurrencySymbol, toCurrencyLabel, toCurrencyAmount) {
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = fromCurrencyAmount;
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = parseFloat(fromCurrencyAmount.toString()); // force to number type
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.toCurrencyAmount = parseFloat(toCurrencyAmount.toString()); //force to number type
    }
    return CurrencyConversion;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CurrencyConversion;
exports.CurrencyConversionType = {
    FIAT: {
        USD: {
            symbol: "USD",
            label: "US Dollar"
        },
        GBP: {
            symbol: "GBP",
            label: "British Pound",
        },
        CNY: {
            symbol: "CNY",
            label: "Chinese Yuan"
        },
        EUR: {
            symbol: "EUR",
            label: "Euro"
        },
        CAD: {
            symbol: "CAD",
            label: "Canada"
        }
    },
    CRYPTO: {
        BTC: {
            symbol: "BTC",
            label: "Bitcoin"
        },
        SYS: {
            symbol: "SYS",
            label: "Syscoin"
        },
        ZEC: {
            symbol: "ZEC",
            label: "ZCash"
        },
        FCT: {
            symbol: "FCT",
            label: "Factom"
        }
    }
};
