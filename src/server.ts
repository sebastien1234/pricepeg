import config from "./config";
import PricePeg from "./PricePeg";
import history from "./history";
import SetupWizard from "./SetupWizard";
import CryptoConverter from "./data/CryptoConverter";
import {logPegMessage} from "./data/Utils";

let express = require('express'),
  app = express(),
  server = require('http').createServer(app);


let setupWizard = new SetupWizard();
setupWizard.setup("./currency.conf").then((configData:CryptoConverter[]) => {
  logPegMessage("TRY TO START PEG.");
  let peg = new PricePeg(configData);
  peg.start();

  let PORT = config.httpport;
  app.use('/', express.static(__dirname + '/static'));
  app.all('/', function (req, res) {
    history(req, res, peg);
  });

  server.listen(PORT);
},
(rejectReason) => {
  logPegMessage("Error loading config: " + JSON.stringify(rejectReason));
});

