"use strict";
var logLevel = {
    logNetworkEvents: false,
    logBlockchainEvents: true,
    logPriceCheckEvents: true,
    logUpdateLoggingEvents: true
};
exports.defaultConfig = {
    currencies: [],
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
    version: "1.3.0"
};
var config = {
    currencies: [],
    maxUpdatesPerPeriod: null,
    updatePeriod: null,
    updateThresholdPercentage: null,
    updateInterval: null,
    enableLivePegUpdates: null,
    enablePegUpdateDebug: null,
    debugPegUpdateInterval: null,
    debugPegUpdateIncrement: null,
    rpcserver: null,
    rpcuser: null,
    rpcpassword: null,
    rpcport: null,
    rpctimeout: null,
    pegalias: null,
    pegalias_aliaspeg: null,
    httpport: null,
    logLevel: null,
    debugLogFilename: null,
    updateLogFilename: null,
    version: null
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
