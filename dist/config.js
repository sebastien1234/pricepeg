"use strict";
var logLevel = {
    logNetworkEvents: false,
    logBlockchainEvents: true,
    logPriceCheckEvents: true,
    logUpdateLoggingEvents: true
};
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
    httpport: 8080,
    logLevel: logLevel,
    debugLogFilename: "peg.log",
    updateLogFilename: "peg-update-history.log",
    version: "1.2.1"
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.config;
