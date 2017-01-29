"use strict";
var CurrencyConversion_1 = require("./data/CurrencyConversion");
var Utils_1 = require("./data/Utils");
var config_1 = require("./config");
exports.getHistoryPage = function (req, res, peg) {
    var config = config_1.getConfig();
    var updateTime = (config.updateInterval / 60).toFixed(2).indexOf(".00") == -1 ? (config.updateInterval / 60).toFixed(2) : (config.updateInterval / 60);
    var formattedUpdateThreshold = (config.updateThresholdPercentage * 100).toString().indexOf(".") == -1 ? (config.updateThresholdPercentage * 100).toString() : (config.updateThresholdPercentage * 100).toString().substr(0, (config.updateThresholdPercentage * 100).toString().indexOf(".") + 4);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("\n    <!DOCTYPE html><html><head> \n    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\" integrity=\"sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7\" crossorigin=\"anonymous\"> \n    <link rel=\"stylesheet\" href=\"style.css\">   \n    <script   src=\"https://code.jquery.com/jquery-2.2.2.min.js\"   integrity=\"sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=\"   crossorigin=\"anonymous\"></script> \n    <!-- Latest compiled and minified JavaScript -->    \n    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js\" integrity=\"sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS\" crossorigin=\"anonymous\"></script> \n    \n    <meta charset=\"utf-8\"> \n    <title>Syscoin Price Peg History</title> \n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> \n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n     \n    <link rel=\"icon\" href=\"http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=32%2C32\" sizes=\"32x32\" /> \n    <link rel=\"icon\" href=\"http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=192%2C192\" sizes=\"192x192\" />  \n    <link rel=\"apple-touch-icon-precomposed\" href=\"http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=180%2C180\" /> \n    <meta name=\"msapplication-TileImage\" content=\"http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=270%2C270\" /> \n     \n    </head><body class=\"container\" style=\"padding: 10px\"> \n     \n    <div class=\"jumbotron\"> \n    <div style=\"text-align:center\"><img src=\"syscoin_icon.png\" width=\"200\" height=\"200\" style=\"\" /></div>\n    <p style=\"font-size:18px; text-align: center\">\n    The Syscoin Team price peg uses the \"" + config.pegalias + "\" alias on the Syscoin blockchain and is the default price peg for all items being sold on the \n    Syscoin Decentralized Marketplace. The price peg uses averages rates from Bittrex and Poloniex for each supported cryptocurrency, USD/BTC rates from Coinbase, and USD/Fiat rates from <a href=\"http://fixer.io\">Fixer.io.</a> <br><br>\n    The \"" + config.pegalias + "\" price peg is automatically updated when any of the supported currency's exchange rates change by +/- " + formattedUpdateThreshold + "% of the current rates stored on the blockchain. This check is performed every " + updateTime + " minutes. b\n    \n    For more information on how price pegging works in Syscoin please <a href=\"http://syscoin.org/faqs/price-pegging-work/\">see the FAQ.</a><br><br>\n    Values in the below are trimmed to 2 decimals. Full value can be seen in history here or on the blockchain. To support the Syscoin team price peg please send SYS to \"" + config.pegalias + "\", all funds are used to cover alias update costs.</p>\n    \n    <p class=\"disclaimer\"><b>Disclaimer:</b> The Syscoin Team does its best to ensure the price peg is running properly 24/7/365 and that rates produced by the peg are accurate based on market rates.\n    By using the Syscoin Team price peg you acknowledge this and release the team for any liability related to inaccuracies or erroneous peg values.</p>\n    <div style=\"text-align: center\">");
    for (var i = 0; i < peg.sysRates.rates.length; i++) {
        var rate = peg.sysRates.rates[i];
        if (rate.currency == CurrencyConversion_1.CurrencyConversionType.CRYPTO.SYS.symbol)
            continue;
        var formattedValue = rate.rate.toString().indexOf(".") == -1 ? Utils_1.numberWithCommas(rate.rate.toString()) : Utils_1.numberWithCommas(rate.rate.toString().substr(0, rate.rate.toString().indexOf(".") + 3));
        var currencyData = Utils_1.getCurrencyData(rate.currency);
        res.write("<div style=\"padding: 10px; display: inline-block; text-align: center; margin: 0 auto\">\n                <h3><b>" + rate.currency + "/SYS:</b> " + formattedValue + "</h3>\n                <p style=\"font-size: 10px; font-style: italic\">" + formattedValue + " Syscoin = 1 " + Utils_1.capitalizeFirstLetterLowercaseWordPerWord(currencyData.label) + "</p>\n              </div>");
    }
    res.write("</div>\n    <hr><h4>Current Raw Value:</h4> \n    <textarea style=\"width:100%;height:70px\">" + JSON.stringify(peg.sysRates) + "</textarea>\n    </div> \n    \n    <div class=\"panel panel-default\"> \n    <div class=\"panel-heading\"><h4>Update History:</h4></div> \n    <table class=\"table table-striped table-hover\">  \n    <thead>                         \n    <tr> \n    <th width=\"1%\"></th>                           \n    <th width=\"20%\">Date</th>                      \n    <th>Value</th>                      \n    </tr>                           \n    </thead>                        \n    <tbody> \n  ");
    for (var i = peg.updateHistory.length - 1; i >= 0; i--) {
        res.write("<tr>                            \n    <td><span class=\"glyphicon glyphicon-ok\" /></td>      \n    <td>" + exports.timeConverter(peg.updateHistory[i].date) + "</td>      \n    <td style=\"font-family: Lucida Console, monospace\">" + JSON.stringify(peg.updateHistory[i].value) + "</td>      \n    </tr>");
    }
    res.write('</tbody></table></div>');
    res.write("<div style=\"text-align: center; font-size: 11px;\">Syscoin Price Peg Server " + config.version + "</div>");
    res.write('</body></html>');
    res.end();
};
exports.timeConverter = function (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    //let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = date + ' ' + month + ' ' + year + ' ' + exports.formatAMPM(a);
    return time;
};
exports.formatAMPM = function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.getHistoryPage;
//# sourceMappingURL=history.js.map