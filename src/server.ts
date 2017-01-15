import config from "./config";
import PricePeg from "./PricePeg";
import history from "./history";
import SetupWizard from "./SetupWizard";
import {logPegMessage} from "./data/Utils";


let express = require('express'),
  app = express(),
  server = require('http').createServer(app);

let peg = new PricePeg();

let setupWizard = new SetupWizard();
setupWizard.setup("currency.conf").then((validConfig) => {
  logPegMessage("Valid config! Starting Peg.");
  //peg.start();
},
(error) => {
  console.log(`Setup error: ${error}`)
});

let PORT = config.httpport;

app.use('/', express.static(__dirname + '/static'));

app.all('/', function (req, res) {
  history(req, res, peg);
});

server.listen(PORT);