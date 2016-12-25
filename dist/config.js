"use strict";
exports.config = {
    maxUpdatesPerPeriod: 6,
    updatePeriod: 60 * 60 * 1,
    updateThresholdPercentage: 0.01,
    updateInterval: 10,
    enableLivePegUpdates: true,
    enablePegUpdateDebug: false,
    debugPegUpdateInterval: 5,
    debugPegUpdateIncrement: 50,
    rpcserver: "localhost",
    rpcuser: "username",
    rpcpassword: "password",
    rpcport: 8336,
    rpctimeout: 30000,
    pegalias: "pegtest1",
    pegalias_aliaspeg: "pegtest1",
    httpport: 8080
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.config;
//# sourceMappingURL=config.js.map