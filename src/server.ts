import config from "./config";
import PricePeg from "./PricePeg";
import history from "./history";
import SetupWizard from "./SetupWizard";
import CryptoConverter from "./data/CryptoConverter";
import {logPegMessage} from "./data/Utils";


//accept config overrides from command line
let configOverride = null;
try {
  if (process.env.CONFIG) {
    configOverride = JSON.parse(process.env.CONFIG);
    logPegMessage("Loaded config from command line: " + JSON.stringify(configOverride));
  }
} catch (e) {
  logPegMessage("WARNING: Unable to parse config override from commandline.");
}

let express = require('express'),
  app = express(),
  server = require('http').createServer(app);


let setupWizard = new SetupWizard();
setupWizard.setup("./currency.conf", configOverride).then((configData: CryptoConverter[]) => {
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

