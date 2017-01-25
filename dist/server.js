"use strict";
var PricePeg_1 = require("./PricePeg");
var history_1 = require("./history");
var SetupWizard_1 = require("./SetupWizard");
var Utils_1 = require("./data/Utils");
var config_1 = require("./config");
//init the default config object
config_1.setConfig(config_1.defaultConfig);
//accept config overrides from command line
var configOverride = null;
try {
    if (process.env.CONFIG) {
        configOverride = JSON.parse(process.env.CONFIG);
        config_1.setConfig(configOverride);
        Utils_1.logPegMessage("Loaded config from command line: " + JSON.stringify(configOverride));
    }
}
catch (e) {
    Utils_1.logPegMessage("WARNING: Unable to parse config override from commandline.");
}
var express = require('express'), app = express(), server = require('http').createServer(app);
var config = config_1.getConfig();
var setupWizard = new SetupWizard_1.default();
setupWizard.setup("./config.ini", configOverride).then(function (configData) {
    Utils_1.logPegMessage("TRY TO START PEG.");
    var peg = new PricePeg_1.default(configData);
    peg.start();
    var PORT = config.httpport;
    app.use('/', express.static(__dirname + '/static'));
    app.all('/', function (req, res) {
        history_1.default(req, res, peg);
    });
    server.listen(PORT);
}, function (rejectReason) {
    Utils_1.logPegMessage("Error loading config: " + JSON.stringify(rejectReason));
});
//# sourceMappingURL=server.js.map