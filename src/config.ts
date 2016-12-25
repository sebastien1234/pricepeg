export const config = {
  maxUpdatesPerPeriod: 6, // maximum number of peg updates that will occur in a single period
  updatePeriod: 60 * 60 * 1, //duration of a single period in seconds
  updateThresholdPercentage: 0.01, //percentage at which an update is attempted, if value of peg fluctuates +/- this range
  updateVolatilityWarning: 100, //number of update attempts in a single period after which to alert admins to unusual volatility, possibly warranting temp config change
  updateInterval: 10, //time in second to check for updates

  disableLiveCalls: false, //debug mode, disables live updates to peg on network
  debugUpdates: false, //debug mode, enables debug mode which updates peg on set interval w fixed update rather than market rates
  debugUpdatesInterval: 5, //debug mode, how frequently to update peg
  debugUpdatesIncrement: 50, //debug mode, how much to increment USD conversion

  rpcserver: "localhost",
  rpcuser: "username",
  rpcpassword: "password",
  rpcport: 8336,
  rpctimeout: 30000,
  pegalias: "pegtest1",
  pegalias_aliaspeg: "pegtest1",

  httpport: 8080

};

export default config;