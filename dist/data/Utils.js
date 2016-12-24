"use strict";
exports.getDeepValue = function (obj, path) {
    for (var i = 0, pathParts = path.split('.'), len = pathParts.length; i < len; i++) {
        obj = obj[pathParts[i]];
    }
    ;
    return obj;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.getDeepValue;
//# sourceMappingURL=Utils.js.map