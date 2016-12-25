"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.getDeepValue;
//# sourceMappingURL=Utils.js.map