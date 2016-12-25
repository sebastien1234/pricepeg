"use strict";
var config_1 = require("./config");
var PricePeg_1 = require("./PricePeg");
var history_1 = require("./history");
var express = require('express'), app = express(), server = require('http').createServer(app);
var peg = new PricePeg_1.default();
peg.start();
var PORT = config_1.default.httpport;
app.use('/', express.static(__dirname + '/static'));
app.all('/', function (req, res) {
    history_1.default(req, res, peg);
});
server.listen(PORT);
//# sourceMappingURL=server.js.map