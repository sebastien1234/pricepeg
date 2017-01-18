import {PegConfig} from "./common";
export interface LogLevel {
  logNetworkEvents?: boolean;
  logBlockchainEvents?: boolean;
  logPriceCheckEvents?: boolean;
  logUpdateLoggingEvents?: boolean;
}

const logLevel:LogLevel = {
  logNetworkEvents: false,
  logBlockchainEvents: true,
  logPriceCheckEvents: true,
  logUpdateLoggingEvents: true
};

export const defaultConfig: PegConfig = {
  currencies: [],

  maxUpdatesPerPeriod: 6, // maximum number of peg updates that will be allowed to occur in a single period
  updatePeriod: 60 * 60 * 1, //defintion of the duration of a single period in seconds
  updateThresholdPercentage: 0.01, //percentage at which an update is attempted, if value of peg fluctuates +/- this range
  updateInterval: 10, //time in second to check for price change updates

  enableLivePegUpdates: true, //debug mode, disables live updates to peg on network
  enablePegUpdateDebug: false, //debug mode, enables debug mode which updates peg on set interval w fixed update rather than market rates
  debugPegUpdateInterval: 5, //debug mode, how frequently to update peg
  debugPegUpdateIncrement: 50, //debug mode, how much to increment USD conversion

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

let config = {
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

export default config;


