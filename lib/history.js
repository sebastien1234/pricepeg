'use strict';

function getHistoryPage(req, res, peg) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<!DOCTYPE html><html ><head>');
  res.write('<meta charset="utf-8">');
  res.write('<title>Syscoin Price Peg History</title>');
  res.write('<link rel=stylesheet href=../styles/styles.css rel=stylesheet />');
  //res.write('<script src=script.js type=text/javascript></script>');
  res.write('</head><body>');

  res.write('<h1>Syscoin Price Peg</h1>');
  res.write('<h3>USD/BTC: ' + peg.sysRates.rates[0].rate + '</h3>');
  res.write('<textarea rows="5" cols="50">' + JSON.stringify(peg.sysRates) + '</textarea>');

  res.write('<h2>Update History:</h2>');
  res.write('<table border="1"><tr><td>Date/Time</td><td>Value</td></tr>');
  for(var i = 0; i < peg.updateHistory.length; i++) {
    res.write('<tr><td>' + timeConverter(peg.updateHistory[i].date) + '</td><td> ' + JSON.stringify(peg.updateHistory[i].value) + '</td></tr>');
  }
  res.write('</table>');
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
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

module.exports = getHistoryPage;