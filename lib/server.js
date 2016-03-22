'use strict'

var express = require('express'),
  app = express(),
  server = require('http').createServer(app);

var PricePeg = require('./PricePeg');
var history = require('./history');

var peg = new PricePeg();
peg.start();

const PORT=8080;

app.use('/', express.static(__dirname + '/static'));

app.all('/history', function (req, res) {
  history(req, res, peg);
});

server.listen(PORT);