'use strict'

var express = require('express'),
  app = express(),
  server = require('http').createServer(app);

var config = require('./config');
var PricePeg = require('./PricePeg');
var history = require('./history');

var peg = new PricePeg();
peg.start();

var PORT = config.httpport;

app.use('/', express.static(__dirname + '/static'));

app.all('/', function (req, res) {
  history(req, res, peg);
});

server.listen(PORT);