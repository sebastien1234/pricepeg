let express = require('express'),
  app = express(),
  server = require('http').createServer(app);

import config from './config';
import PricePeg from './PricePeg';
import history from './history';

let peg = new PricePeg();
peg.start();

let PORT = config.httpport;

app.use('/', express.static(__dirname + '/static'));

app.all('/', function (req, res) {
  history(req, res, peg);
});

server.listen(PORT);