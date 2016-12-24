"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Utils_1 = require("./Utils");
var BaseConversionDataSource_1 = require("./BaseConversionDataSource");
var CurrencyConversion_1 = require("./CurrencyConversion");
var PoloniexDataSource = (function (_super) {
    __extends(PoloniexDataSource, _super);
    function PoloniexDataSource() {
        var _this = _super.apply(this, arguments) || this;
        _this.formatCurrencyConversionData = function (rawCurrencyResponseData) {
            //console.log("Handling response in poloniex handler.");
            _this.formattedCurrencyConversionData = new CurrencyConversion_1.default(_this.baseCurrencySymbol, _this.baseCurrencyLabel, 1, "BTC", "Bitcoin", Utils_1.default(rawCurrencyResponseData, _this.responseDataPath));
        };
        return _this;
    }
    return PoloniexDataSource;
}(BaseConversionDataSource_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PoloniexDataSource;
//# sourceMappingURL=PoloniexDataSource.js.map