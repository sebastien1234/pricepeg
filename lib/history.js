'use strict';

function getHistoryPage(req, res, peg) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('   \
    <!DOCTYPE html><html><head> \
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous"> \
    <link rel="stylesheet" href="style.css">   \
    <script   src="https://code.jquery.com/jquery-2.2.2.min.js"   integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI="   crossorigin="anonymous"></script> \
    <!-- Latest compiled and minified JavaScript -->    \
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script> \
    \
    <meta charset="utf-8"> \
    <title>Syscoin Price Peg History</title> \
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
    <meta name="viewport" content="width=device-width, initial-scale=1">\
     \
    <link rel="icon" href="http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=32%2C32" sizes="32x32" /> \
    <link rel="icon" href="http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=192%2C192" sizes="192x192" />  \
    <link rel="apple-touch-icon-precomposed" href="http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=180%2C180" /> \
    <meta name="msapplication-TileImage" content="http://i1.wp.com/syscoin.org/wp-content/uploads/2016/03/cropped-White-Logo-640x130.png?fit=270%2C270" /> \
     \
    </head><body class="container" style="padding: 10px"> \
     \
    <div class="jumbotron"> \
    <div style="text-align:center"><img src="syscoin_icon.png" width="200" height="200" style="" /></div>\
    <p style="font-size:18px; text-align: center">\
    The Syscoin Team price peg uses the SYS_RATES alias on the Syscoin blockchain and is the default price peg for all items being sold on the \
    Syscoin Decentralized Marketplace. The price peg uses averages SYS/BTC rates from Bittrex and Poloniex, USD/BTC rates from Coinbase, and USD/Fiat rates from Fixer.io. \
    The SYS_RATES price peg is updated anytime the SYS/BTC or USD/BTC price moves +/- 5% of the current values stored on the blockchain. \
    The rates below represent the amount of Syscoin it would take to equal 1 unit of the given currencies based on market rates. \
    For more information on how price pegging works in Syscoin please <a href="http://syscoin.org/faqs/price-pegging-work/">see the FAQ.</a><br><br>\
    Values in the below are trimmed to 2 decimals. Full value can be seen in history here or on the blockchain.</p>\
    \
    <p class="disclaimer"><b>Disclaimer:</b> The Syscoin Team does its best to ensure the price peg is running properly 24/7/365 and that rates produced by the peg are accurate based on market rates.\
    By using the Syscoin Team price peg you acknowledge this and release the team for any liability related to inaccuracies or erroneous peg values.</p>\
    <table style="text-align:center; width: 100%">\
    <tr>');
  for (var i = 0; i < peg.sysRates.rates.length - 1; i++) {
    res.write('<td style="padding: 10px"><h3><b>' + peg.sysRates.rates[i].currency + '/SYS:</b> ' + peg.sysRates.rates[i].rate.toString().substr(0, peg.sysRates.rates[i].rate.toString().indexOf(".") + 2) + '</h3></td>');
  }

  res.write('</tr>\
    </table>\
    <hr><h4>Current Raw Value:</h4> \
    <textarea style="width:100%;height:70px">' + JSON.stringify(peg.sysRates) + '</textarea>\
    </div> \
    \
    <div class="panel panel-default"> \
    <div class="panel-heading"><h4>Update History:</h4></div> \
    <table class="table table-striped table-hover">  \
    <thead>                         \
    <tr> \
    <th width="1%"></th>                           \
    <th width="20%">Date</th>                      \
    <th>Value</th>                      \
    </tr>                           \
    </thead>                        \
    <tbody> \
  ');

  for (var i = peg.updateHistory.length - 1; i >= 0; i--) {
    res.write('<tr>                            \
    <td><span class="glyphicon glyphicon-ok" /></td>      \
    <td>' + timeConverter(peg.updateHistory[i].date) + '</td>      \
    <td style="font-family: Lucida Console, monospace">' + JSON.stringify(peg.updateHistory[i].value) + '</td>      \
    </tr>');
  }
  res.write('</tbody></table></div>');
  res.write('</body></html>');
  res.end();
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var time = date + ' ' + month + ' ' + year + ' ' + formatAMPM(a);

  return time;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

  return strTime;
}

module.exports = getHistoryPage;