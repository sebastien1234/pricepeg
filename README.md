# Syscoin Price Peg Server
The Syscoin Price Peg Server is a NodeJS server application for maintaining a  Syscoin "Alias Peg" on the the Syscoin network's blockchain. An Alias peg provides information to the network on how many Syscoins are needed to equal 1 unit of any other currency supported by the peg. 

---

## How it Works
The peg server uses data from multiple sources to derive the necessary values to convert values between various currencies. Fixer.io is used for all fiat currency conversion information, Coinbase is used for all BTC/USD conversion information, and a mix of Poloniex and Bittrex are used for all other blockchain currency information. The server watches each configured currency pair independently and when any one currency exchange rate moves outside the configured threshold, the updated values are writted to the peg-alias on the Syscoin blockchain.

## Installation and Setup
Syscoin Price Peg Server installation requires [NPM and Node](https://nodejs.org/en/download/) 7+. 

1. If installing from source first clone the repository using `git clone https://github.com/syscoin/pricepeg.git`. Alternatively you can also install directly from NPM using `npm install syscoin-price-peg-server`.
2. The server comes with a default config.ini file which controls all aspects of the server, including which currencies it supports. For more information please refer to the [configuration section]().
3. Update the configuration file to reflect the Alias you with to use as a peg and the currencies you wish to support. **You MUST create the peg alias on the Syscoin network with a public value of `{"rates":[]}` BEFORE attempting to run Price Peg Server to manage it!**

## Supported Currencies
The full list of supported currencies can be found in [`src/common.ts: supportedCurrencies`](https://github.com/syscoin/pricepeg/blob/dev_1.3/src/common.ts#L74) or in the [table at the bottom of this page](#full-supported-currencies-list).

## Running the Server
The Price Peg Server must be run as a daemon. There are two optons for this:

* **(Recommended)** Install [pm2](https://www.npmjs.com/package/pm2) for better running and monitoring of the server in daemon mode.
	1.	Install [pm2](https://www.npmjs.com/package/pm2) globall using `npm install -g pm2`.
	2. Ensure pm2 is updated- `pm2 update`.
	3. Run the server in daemon mode using `npm run startd`.
	4. (Optional) You can now use pm2's tooling for insights on how many resources the Peg Server is using and even launch it in multiprocess or clustered mode.
* If you use the [screen](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-screen-on-an-ubuntu-cloud-server) application you can start the server by simply running `screen npm run start`. *Make sure to detach from the screen without terminating it!*

## Server Configuration
The Syscoin Price Peg Server can easily be reconfigured with zero coding knowledge. Below are the configuration properties and options. The [default configuration file](https://github.com/syscoin/pricepeg/blob/master/config.ini) can also be used as a reference. <br>
<br>
We've also included some sample configurations to further illustrate how to customize the Syscoin Price Peg Server:

* **[Sample Config #1 DOGE/USD Peg w/ mods](https://github.com/syscoin/pricepeg/tree/dev_1.3#sample-config-1---peg-supporting-doge-and-usd-with-modified-triggers)**
* **[Sample Config #2 BTC/XMR/ZEC/ETH Peg w/ mods](https://github.com/syscoin/pricepeg/tree/dev_1.3#sample-config-2---peg-supporting-only-xmr-zcash-btc-and-eth-with-modified-triggers-and-logging-customizations)**

| Property Name | Description | Default Value | Required/Optional |
|---            |---          |---            |---                | 
| **currencies.[*CurrencySymbol*]** | Defines a currency to be supported by this peg server. Each currency entry should represent a seperate currency, and should define the [CurrencyConfig](#currency-config) to be used for that currency.  | [ ] | required |
| **maxUpdatesPerPeriod** | Maximum number of peg updates that will be allowed to occur in a single period  | 6 | required |
| **updatePeriod** | Duration of a single period in seconds  | 3600 | required |
| **updateThresholdPercentage** | Percentage at which an update is attempted, if value of any peg-supported currency's exchange rate changes +/- this range vs. what is currently stored in the peg alias  | 0.05 | required |
| **updateInterval** | Time in second to check for price change updates of a single period in seconds  | 300 | required |
| **pegalias** | Alias on Syscoin network to update monitor and update as an alias-peg  | pegtest1 | required |
| **pegalias_aliaspeg** | Alias on Syscoin network specified as the aliaspeg of the peg-alias. Typically the same value as pegalias  | pegtest1 | required |
| <br> | | | | |
| **enableLivePegUpdates** | Debug mode, disables live updates to peg on network | true | *optional* |
| **enablePegUpdateDebug** | Debug mode, updates peg on set interval w fixed increment rather than market rates  | false | *optional* |
| **debugPegUpdateInterval** | Debug mode, how frequently to update peg in seconds | 5 | *optional* |
| **debugPegUpdateIncrement** | Debug mode, how much to increment USD conversion | 50 | *optional* |
| <br> | | | | |
| **rpcserver** | Syscoin JSONRPC host server  | localhost | required |
| **rpcuser** | Auth info for Syscoin JSONRPC  | username | required |
| **rpcpassword** | Auth info for Syscoin JSONRPC | password | required |
| **rpcport** | Syscoin JSONRPC port  | 8336 | *optional* |
| **rpctimeout** | Syscoin JSONRPC server timeout  | 30000 | *optional* |
| **httpport** | Port from which the Syscoin Price Peg server will server HTTP content  | 8080 | *optional* |
| <br> | | | | |
| **logLevel** | Should define a [LogLevel](#log-level) to control the verbosity of the log output  | logNetworkEvents=false <br> logBlockchainEvents=true <br> logPriceCheckEvents=true <br> logUpdateLoggingEvents=true | *optional* |
| **debugLogFilename** | Name of the file that peg log output will be saved  | peg.log | *optional* |
| **updateLogFilename** | Name of the file that the peg-update-history will be written to; this differs from `debugLogFilename` in that it only contains the history of the peg-alias data, so that in the case of a server stop/start the history is maintained without needing to re-query the blockchain  | peg-update-history.log | *optional* |

#### Currency Config 
| Property Name | Description | Default Value | Required/Optional |
|---            |---          |---            |---                | 
| **currencySymbol** | Symbol used to identify this currency on exchanges- ie: USD, EUR, SYS, BTC, etc.  | n/a | required |
| **isFiat** | Whether or not this currency is a fiat currency  | n/a | required |
| **dataSources** | Comma-delimitted list of exchanges from which to pull exchange values from for this currency. The results will be averaged for more accurate market pricing. Valid values are "Bittrex", "Poloniex" or "Bittrex, Poloniex"  | n/a | *optional* - only required for non-fiat currency |
| **escrowFee** | Percentage fee that arbiters will earn when their involvement is needed, specific to this currency  | n/a | *optional* |
| **fee** | Service fee associated with Syscoin services, specific to the alias peg and currency used  | n/a | *optional* |
| **precision** | Precision of currency conversion in decimals  | n/a | required |

#### LogLevel Config 
| Property Name | Description | Default Value | Required/Optional |
|---            |---          |---            |---                | 
| **logNetworkEvents** | Should network events be written to the log- such as requests for exchange data, parsing that data, etc.  | false | *optional* |
| **logBlockchainEvents** | Should blockchain events be written to the log- such as queiries for data from the blockchain, the results of those queries, attempts to update blockchain data, etc.  | true | *optional* |
| **logPriceCheckEvents** | Should exchange price-check events be written to the log- comparing the current values stored in the peg alias to those being returned from the exchange data sources, if the price has changed outside the configured threshold, etc.   | true | *optional* |
| **logUpdateLoggingEvents** | Should history-update events be written to the log- attempts to read and write from the `updateLogFilename` and their success/failure | true | *optional* |

**IMPORTANT NOTE:** Many properties that are typically required are marked as *optional* in the above table because the Syscoin Price Peg server has been developed in a way to provide all required values, in the form of their default values if the operator fails to override them (with the exception of `CurrencyConfig`. The server also has rudimentary configuration file validation- in situations where the server fails to start please review the output in the `debugLogFilename` for information on what the issues are with the configuration file.

### Example Config.ini
Syscoin Price Peg Server is controlled through `config.ini` which uses the [INI configuration file format](https://en.wikipedia.org/wiki/INI_file). Below are some example configurations, for more info or questions please [create an issue](https://github.com/syscoin/pricepeg/issues) or [ask in the Syscoin Slack](http://join.syscoin.org).

#### Sample Config #1 - Peg supporting DOGE and USD with modified triggers.

* Support DOGE and USD 
* Use peg-alias of "doge.peg" 
* Limit to 3 updates per period
* Change update period to 3 days rather than the default 1hr
* Change update threshold to 1% rather than default 5%
* Change the auth info for server

> ;BASIC CONFIG <br>
> ;maximum number of peg updates that will be allowed to occur in a single period <br>
> maxUpdatesPerPeriod = 3 <br>
> <br>
> ;defintion of the duration of a single period in seconds <br>
> updatePeriod = 259200 <br>
> <br>
> ;percentage at which an update is attempted, if value of peg fluctuates +/- this range <br>
> updateThresholdPercentage = 0.01<br>
> <br>
> rpcuser = secretuser <br>
> rpcpassword = secretpassword <br>
> pegalias = doge.peg <br>
> pegalias_aliaspeg = doge.peg <br>
> <br>
> ;MODIFY BELOW SECTION TO CHANGE CURRENCY SUPPORT <br>
> [currencies.USD] <br>
> isFiat = true <br>
> escrowFee = 0.01 <br>
> precision = 2 <br>
> <br>
> [currencies.BTC] <br>
> isFiat = false <br>
> dataSources = Poloniex, Bittrex <br>
> escrowFee = 0.01 <br>
> fee = 75 <br>
> precision = 8 <br>

#### Sample Config #2 - Peg supporting only XMR, ZCash, BTC, and ETH with modified triggers and logging customizations

* Support XMR, ZCash, BTC, and ETH
* Use peg-alias of "multicrypto.peg" 
* Change update threshold to 10% rather than default 5%
* Change the auth info for server
* Change LogLevel config
* Change log file name

> ;BASIC CONFIG <br>
> ;percentage at which an update is attempted, if value of peg fluctuates +/- this range <br>
> updateThresholdPercentage = 0.1<br>
> debugLogFilename = mypeg.log<br>
> <br>
> rpcuser = secretuser <br>
> rpcpassword = secretpassword <br>
> pegalias = multicrypto.peg <br>
> pegalias_aliaspeg = multicrypto.peg <br>
> <br>
> [logLevel] <br>
> logNetworkEvents = true <br>
> logBlockchainEvents = false <br>
> logPriceCheckEvents = true <br>
> logUpdateLoggingEvents = false <br>
> <br>
> ;MODIFY BELOW SECTION TO CHANGE CURRENCY SUPPORT <br>
> [currencies.BTC] <br>
> isFiat = false <br>
> dataSources = Poloniex, Bittrex <br>
> escrowFee = 0.01 <br>
> fee = 75 <br>
> precision = 8 <br>
> <br>
> [currencies.XMR] <br>
> isFiat = false <br>
> dataSources = Poloniex <br>
> escrowFee = 0.05 <br>
> fee = 100 <br>
> precision = 8 <br>
> <br>
> [currencies.ZEC] <br>
> isFiat = false <br>
> dataSources = Poloniex, Bittrex <br>
> escrowFee = 0.05 <br>
> fee = 75 <br>
> precision = 5 <br>
> <br>
> [currencies.ETH] <br>
> isFiat = false <br>
> dataSources = Poloniex, Bittrex <br>
> escrowFee = 0.1 <br>
> fee = 200 <br>
> precision = 5 <br>

## Building
Syscoin Price Peg Server is built using Typescript and ES6. Developers are encouraged to extend and enhance the native functionality, or add more currency support. Devs will need to work in the native Typescript files then transpile the code for distribution. The only command needed to rebuild code after changes is `npm run build` to rebuild the source and all resources to `dist`.

## Further Development
We encourage community contributon! If you wish to contribute please issue a pull request with your changes, the team will review and merge or provide feedback. All development should happen in the `/src` folder. All new files should be Typescript, using ES6 JS syntax.

## Full Supported Currencies List
Symbol | Name | isFiat |
--- | ---| --- | 
**USD** | US Dollar | true | 
**GBP** | British Pound | true | 
**CNY** | Chinese Yuan | true | 
**EUR** | Euro | true | 
**CAD** | Canada | true | 
**AUD** | Australian Dollar | true | 
**BGN** | Bulgarian Lev | true | 
**BRL** | Brazilian Real | true | 
**CHF** | Swiss Franc | true | 
**CZK** | Czech Republic Koruna | true | 
**DKK** | Danish Krone | true | 
**HKD** | Hong Kong Dollar | true | 
**HRK** | Croatian Kuna | true | 
**HUF** | Hungarian Forint | true | 
**IDR** | Indonesian Rupiah | true | 
**ILS** | Israeli New Shekel | true | 
**INR** | Indian Rupee | true | 
**JPY** | Japanese Yen | true | 
**KRW** | South Korean Won | true | 
**MXN** | Mexican Peso | true | 
**MYR** | Malaysian Ringgit | true | 
**NOK** | Norwegian Krone | true | 
**NZD** | New Zealand Dollar | true | 
**PHP** | Philippine Peso | true | 
**PLN** | Polish Zloty | true | 
**RON** | Romanian Leu | true | 
**RUB** | Russian Ruble | true | 
**SEK** | Swedish Krona | true | 
**SGD** | Singapore Dollar | true | 
**THB** | Thai Baht | true | 
**TRY** | Turkish Lira | true | 
**ZAR** | South African Rand | true | 
**AMP** | Synereo Amp | false | 
**ARDR** | Ardor | false | 
**BBR** | Boolberry | false | 
**BTC** | Bitcoin | false | 
**BCN** | Bytecoin | false | 
**BCY** | Bitcrystals | false | 
**BELA** | Bellacoin | false | 
**BITS** | Bitstar | false | 
**BLK** | Blackcoin | false | 
**BTCD** | Bitcoindark | false | 
**BTM** | Bitmark | false | 
**BTS** | Bitshares | false | 
**BURST** | Burst | false | 
**C2** | Coin2.0 | false | 
**CLAM** | Clams | false | 
**CURE** | Curecoin | false | 
**DASH** | Dash | false | 
**DCR** | Decred | false | 
**DGB** | Digibyte | false | 
**DOGE** | Dogecoin | false | 
**EMC2** | Einsteinium | false | 
**ETC** | Ethereum Classic | false | 
**ETH** | Ethereum | false | 
**EXP** | Expanse | false | 
**FCT** | Factom | false | 
**FLDC** | Foldingcoin | false | 
**FLO** | Florincoin | false | 
**GAME** | Gamecredits | false | 
**GRC** | Gridcoin Research | false | 
**HUC** | Huntercoin | false | 
**HZ** | Horizon | false | 
**IOC** | IO Digital | false | 
**LBC** | LBRY Credits | false | 
**LSK** | Lisk | false | 
**LTC** | Litecoin | false | 
**MAID** | Maidsafecoin | false | 
**MYR** | Myriadcoin | false | 
**NAUT** | Nautiluscoin | false | 
**NAV** | Navcoin | false | 
**NEOS** | Neoscoin | false | 
**NMC** | Namecoin | false | 
**NOBL** | Noblecoin | false | 
**NOTE** | DNotes | false | 
**NSR** | Nushares | false | 
**NXC** | Nexium | false | 
**NXT** | NXT | false | 
**OMNI** | Omni | false | 
**PINK** | Pinkcoin | false | 
**POT** | Potcoin | false | 
**PPC** | Peercoin | false | 
**QBK** | Qibuck | false | 
**QORA** | Qora | false | 
**QTL** | Quatloo | false | 
**RADS** | Radium | false | 
**RBY** | Rubycoin | false | 
**REP** | Augur | false | 
**RIC** | Riecoin | false | 
**SBD** | Steem Dollars | false | 
**SC** | Siacoin | false | 
**SDC** | Shadow | false | 
**SJCX** | Storjcoin X | false | 
**STEEM** | Steem | false | 
**STR** | Stellar | false | 
**STRAT** | Stratis | false | 
**SYS** | Syscoin | false | 
**UNITY** | Supernet | false | 
**VIA** | Viacoin | false | 
**WAVES** | Waves | false | 
**VOX** | Voxels | false | 
**VTC** | Vertcoin | false | 
**XBC** | Bitcoinplus | false | 
**XCP** | Counterparty | false | 
**XEM** | NEM | false | 
**XMG** | Magi | false | 
**XMR** | Monero | false | 
**XPM** | Primecoin | false | 
**XRP** | Ripple | false | 
**XVC** | VCash | false | 
**ZEC** | ZCash | false | 





