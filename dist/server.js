"use strict";
var config_1 = require("./config");
var PricePeg_1 = require("./PricePeg");
var history_1 = require("./history");
var SetupWizard_1 = require("./SetupWizard");
var Utils_1 = require("./data/Utils");
//accept config overrides from command line
var configOverride = null;
try {
    if (process.env.CONFIG) {
        configOverride = JSON.parse(process.env.CONFIG);
        Utils_1.logPegMessage("Loaded config from command line: " + JSON.stringify(configOverride));
    }
}
catch (e) {
    Utils_1.logPegMessage("WARNING: Unable to parse config override from commandline.");
}
var express = require('express'), app = express(), server = require('http').createServer(app);
var setupWizard = new SetupWizard_1.default();
setupWizard.setup("./currency.conf", configOverride).then(function (configData) {
    Utils_1.logPegMessage("TRY TO START PEG.");
    var peg = new PricePeg_1.default(configData);
    peg.start();
    var PORT = config_1.default.httpport;
    app.use('/', express.static(__dirname + '/static'));
    app.all('/', function (req, res) {
        history_1.default(req, res, peg);
    });
    server.listen(PORT);
}, function (rejectReason) {
    Utils_1.logPegMessage("Error loading config: " + JSON.stringify(rejectReason));
});
