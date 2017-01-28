# Syscoin Price Peg Server
The Syscoin Price Peg Server is a NodeJS server application for maintaining a  Syscoin "Alias Peg" on the the Syscoin network's blockchain. An Alias peg provides information to the network on how many Syscoins are needed to equal 1 unit of any other currency supported by the peg. 



## How it Works
The peg server uses data from multiple sources to derives the necessary values to convert values between various currencies. Fixer.io is used for all fiat currency conversion information, Coinbase is used for all BTC/USD conversion information, and a mix of Poloniex and Bittrex are used for all other blockchain currency information.

## Installation
Syscoin Price Peg Server installation requires [NPM and Node](https://nodejs.org/en/download/) 7+. 

1. If installing from source first clone the repository using `git clone https://github.com/syscoin/pricepeg.git`. Alternatively you can also install directly from NPM using `npm install syscoin-price-peg-server`.
2. The server comes with a default config.ini file which controls all aspects of the server, including which currencies it supports. For more information please refer to the [configuration section]().
3. Update the configuration file to reflect the Alias you with to use as a peg and the currencies you wish to support.

## Supported Currencies
The full list of supported currencies can be found in `src/common.ts: supportedCurrencies` or in the [table at the bottom of this page](#full-supported-currencies-list).

## Running the Server
The Price Peg Server must be run as a daemon. There are two optons for this:

* **(Recommended)** Install [pm2](https://www.npmjs.com/package/pm2) for better running and monitoring of the server in daemon mode.
	1.	Install [pm2](https://www.npmjs.com/package/pm2) globall using `npm install -g pm2`.
	2. Ensure pm2 is updated- `pm2 update`.
	3. Run the server in daemon mode using `npm run startd`.
	4. (Optional) You can now use pm2's tooling for insights on how many resources the Peg Server is using and even launch it in multiprocess or clustered mode.
* If you use the [screen](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-screen-on-an-ubuntu-cloud-server) application you can start the server by simply running `screen npm run start`. *Make sure to detach from the screen without terminating it!*

## Server Configuration
The Syscoin Price Peg Server can easily be reconfigured with zero coding knowledge. Below are the configuration properties and options. The [default configuration file](https://github.com/syscoin/pricepeg/blob/master/config.ini) can also be used as a reference.

This is a table:

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

You can align cell contents with syntax like this:

| Left Aligned  | Center Aligned  | Right Aligned |
|:------------- |:---------------:| -------------:|
| col 3 is      | some wordy text |         $1600 |
| col 2 is      | centered        |           $12 |
| zebra stripes | are neat        |            $1 |

The left- and right-most pipes (`|`) are only aesthetic, and can be omitted. The spaces don’t matter, either. Alignment depends solely on `:` marks.


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
**AMP** | SYNEREO AMP | false | 
**ARDR** | ARDOR | false | 
**BBR** | BOOLBERRY | false | 
**BTC** | BITCOIN | false | 
**BCN** | BYTECOIN | false | 
**BCY** | BITCRYSTALS | false | 
**BELA** | BELLACOIN | false | 
**BITS** | BITSTAR | false | 
**BLK** | BLACKCOIN | false | 
**BTCD** | BITCOINDARK | false | 
**BTM** | BITMARK | false | 
**BTS** | BITSHARES | false | 
**BURST** | BURST | false | 
**C2** | COIN2.0 | false | 
**CLAM** | CLAMS | false | 
**CURE** | CURECOIN | false | 
**DASH** | DASH | false | 
**DCR** | DECRED | false | 
**DGB** | DIGIBYTE | false | 
**DOGE** | DOGECOIN | false | 
**EMC2** | EINSTEINIUM | false | 
**ETC** | ETHEREUM CLASSIC | false | 
**ETH** | ETHEREUM | false | 
**EXP** | EXPANSE | false | 
**FCT** | FACTOM | false | 
**FLDC** | FOLDINGCOIN | false | 
**FLO** | FLORINCOIN | false | 
**GAME** | GAMECREDITS | false | 
**GRC** | GRIDCOIN RESEARCH | false | 
**HUC** | HUNTERCOIN | false | 
**HZ** | HORIZON | false | 
**IOC** | IO DIGITAL | false | 
**LBC** | LBRY CREDITS | false | 
**LSK** | LISK | false | 
**LTC** | LITECOIN | false | 
**MAID** | MAIDSAFECOIN | false | 
**MYR** | MYRIADCOIN | false | 
**NAUT** | NAUTILUSCOIN | false | 
**NAV** | NAVCOIN | false | 
**NEOS** | NEOSCOIN | false | 
**NMC** | NAMECOIN | false | 
**NOBL** | NOBLECOIN | false | 
**NOTE** | DNOTES | false | 
**NSR** | NUSHARES | false | 
**NXC** | NEXIUM | false | 
**NXT** | NXT | false | 
**OMNI** | OMNI | false | 
**PINK** | PINKCOIN | false | 
**POT** | POTCOIN | false | 
**PPC** | PEERCOIN | false | 
**QBK** | QIBUCK | false | 
**QORA** | QORA | false | 
**QTL** | QUATLOO | false | 
**RADS** | RADIUM | false | 
**RBY** | RUBYCOIN | false | 
**REP** | AUGUR | false | 
**RIC** | RIECOIN | false | 
**SBD** | STEEM DOLLARS | false | 
**SC** | SIACOIN | false | 
**SDC** | SHADOW | false | 
**SJCX** | STORJCOIN X | false | 
**STEEM** | STEEM | false | 
**STR** | STELLAR | false | 
**STRAT** | STRATIS | false | 
**SYS** | SYSCOIN | false | 
**UNITY** | SUPERNET | false | 
**VIA** | VIACOIN | false | 
**WAVES** | WAVES | false | 
**VOX** | VOXELS | false | 
**VTC** | VERTCOIN | false | 
**XBC** | BITCOINPLUS | false | 
**XCP** | COUNTERPARTY | false | 
**XEM** | NEM | false | 
**XMG** | MAGI | false | 
**XMR** | MONERO | false | 
**XPM** | PRIMECOIN | false | 
**XRP** | RIPPLE | false | 
**XVC** | VCASH | false | 
**ZEC** | ZCASH | false | 



