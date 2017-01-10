"use strict";
var _this = this;
var fs = require("fs");
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
    exports.writeToFile("./peg.log", msg + "\n");
};
exports.writeToFile = function (filePath, content, append) {
    if (append === void 0) { append = true; }
    if (append) {
        fs.appendFile(filePath, content, function (err) {
            if (err) {
                return console.log("ERROR APPENDING TO PEG LOG: ", JSON.stringify(err));
            }
        });
    }
    else {
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                return console.log("ERROR WRITING TO PEG LOG: ", JSON.stringify(err));
            }
        });
    }
};
exports.logPegMessageNewline = function () {
    _this.logPegMessage("", false);
};
exports.getFiatExchangeRate = function (usdRate, conversionRate, precision) {
    var rate = 0;
    rate = usdRate / conversionRate;
    return exports.getFixedRate(rate, precision);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.getDeepValue;
