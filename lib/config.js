var config = {
  maxUpdatesPerPeriod: 2, // maximum number of peg updates that will occur in a single period
  updatePeriod: 60 * 60 * 24, //duration of a single period in seconds
  updateThresholdPercentage: 0.05, //percentage at which an update is attempted, if value of peg fluctuates +/- this range
  updateVolatilityWarning: 100, //number of update attempts in a single period after which to alert admins to unusual volatility, possibly warranting temp config change
  updateInterval: 10, //time in second to check for updates

  disableLiveCalls: true, //debug mode, disables live updates to peg on network
  debugUpdates: true, //debug mode, enables debug mode which updates peg on set interval w fixed update rather than market rates
  debugUpdatesInterval: 3, //debug mode, how frequently to update peg
  debugUpdatesIncrement: 50, //debug mode, how much to increment USD conversion

  rpcserver: "localhost",
  rpcuser: "username",
  rpcpassword: "password",
  rpcport: 8336,
  rpctimeout: 30000,
  pegalias: "pegtest",

  httpport: 8080

};

module.exports = config;
