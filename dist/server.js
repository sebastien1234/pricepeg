"use strict";
var config_1 = require("./config");
var PricePeg_1 = require("./PricePeg");
var history_1 = require("./history");
var SetupWizard_1 = require("./SetupWizard");
var Utils_1 = require("./data/Utils");
var express = require('express'), app = express(), server = require('http').createServer(app);
var peg = new PricePeg_1.default();
var setupWizard = new SetupWizard_1.default();
setupWizard.setup("currency.conf").then(function (validConfig) {
    Utils_1.logPegMessage("Valid config! Starting Peg.");
    //peg.start();
}, function (error) {
    console.log("Setup error: " + error);
});
var PORT = config_1.default.httpport;
app.use('/', express.static(__dirname + '/static'));
app.all('/', function (req, res) {
    history_1.default(req, res, peg);
});
server.listen(PORT);
