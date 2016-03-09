var assert = require('assert');
var sinon = require('sinon');
var rp = require('request-promise');

var BaseConversionDataSource = require('../data/BaseConversionDataSource');

//Base Tests
describe('BaseConversionDataSource', function() {

  before(function (done) {
    sinon
      .stub(rp, 'get')
    done();
  });

  after(function (done) {
    rp.get.restore();
    done();
  });

  it('fetchCurrencyConversionData - Should call the the dataURL for fetching conversion data', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    conversionDataSource.fetchCurrencyConversionData();

    assert(rp.get.calledWith({
      uri: "http://test2.com",
      json: true
    }));
    done();
    });


});