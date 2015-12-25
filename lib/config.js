var config = {
  maxUpdatesPerPeriod: 2, // maximum number of peg updates that will occur in a single period
  updatePeriod: 60 * 60 * 24, //duration of a single period in seconds
  updateThresholdPercentage: 0.05, //percentage at which an update is attempted, if value of peg fluctuates +/- this range
  updateVolatilityWarning: 100 //number of update attempts in a single period after which to alert admins to unusual volatility, possibly warranting temp config change
}

module.exports = config;
