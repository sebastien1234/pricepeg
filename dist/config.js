"use strict";
exports.config = {
    maxUpdatesPerPeriod: 6,
    updatePeriod: 60 * 60 * 1,
    updateThresholdPercentage: 0.01,
    updateVolatilityWarning: 100,
    updateInterval: 10,
    disableLiveCalls: false,
    debugUpdates: false,
    debugUpdatesInterval: 5,
    debugUpdatesIncrement: 50,
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