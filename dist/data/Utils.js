"use strict";
var _this = this;
var fs = require("fs");
var Q = require("q");
var common_1 = require("../common");
var config_1 = require("../config");
exports.getDeepValue = function (obj, path) {
    for (var i = 0, pathParts = path.split('.'), len = pathParts.length; i < len; i++) {
        obj = obj[pathParts[i]];
    }
    return obj;
};
exports.getHumanDate = function (time) {
    // Create a new JavaScript Date object based on the timestamp
    var date = new Date(time);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};
exports.logPegMessage = function (msg, includeTimeStamp) {
    if (includeTimeStamp === void 0) { includeTimeStamp = true; }
    msg = includeTimeStamp ? new Date() + " - " + msg : msg;
    console.log(msg);
    exports.writeToFile(config_1.getConfig().debugLogFilename, msg + "\n");
};
exports.writeToFile = function (filePath, content, append) {
    if (append === void 0) { append = true; }
    var deferred = Q.defer();
    if (append) {
        fs.appendFile(filePath, content, function (err) {
            if (err) {
                exports.logPegMessage("ERROR WRITING TO FILE " + JSON.stringify(err));
                deferred.reject(err);
            }
            deferred.resolve(content);
        });
    }
    else {
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                exports.logPegMessage("ERROR WRITING TO FILE  " + JSON.stringify(err));
                deferred.reject(err);
            }
            deferred.resolve(content);
        });
    }
    return deferred.promise;
};
exports.readFromFile = function (filePath) {
    var deferred = Q.defer();
    fs.readFile(filePath, "utf-8", function (err, data) {
        if (err) {
            exports.logPegMessage("ERROR READING FROM FILE  " + JSON.stringify(err));
            deferred.reject(err);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};
//super simple test to see if the data in the file is in the right format
exports.validateUpdateHistoryLogFormat = function (ratesHistory) {
    if (ratesHistory.length &&
        typeof ratesHistory[0].date === 'number' &&
        typeof ratesHistory[0].value === 'object') {
        return true;
    }
    return false;
};
exports.logPegMessageNewline = function () {
    _this.logPegMessage("", false);
};
exports.getFiatExchangeRate = function (usdRate, conversionRate, precision) {
    var rate = usdRate / conversionRate;
    return exports.getFixedRate(rate, precision);
};
exports.getCurrencyData = function (symbol) {
    for (var i = 0; i < common_1.supportedCurrencies.length; i++) {
        if (common_1.supportedCurrencies[i].symbol == symbol)
            return common_1.supportedCurrencies[i];
    }
    return null;
};
exports.getFixedRate = function (rate, precision) {
    return parseFloat(parseFloat(rate).toFixed(precision));
};
exports.getPercentChange = function (newRate, oldRate) {
    if (newRate != oldRate) {
        return ((newRate - oldRate) / oldRate) * 100;
    }
    return 0;
};
exports.numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
exports.copyFields = function (target, source) {
    for (var id in source) {
        target[id] = source[id];
    }
    return target;
};
exports.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.capitalizeFirstLetterLowercaseWordPerWord = function (str) {
    if (str) {
        var words = str.split(" ");
        words = words.map(function (word) {
            return exports.capitalizeFirstLetter(word.toLowerCase());
        });
        return words.join(" ");
    }
    return null;
};
//# sourceMappingURL=Utils.js.map