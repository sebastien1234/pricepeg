var assert = require('assert');
var sinon = require('sinon');
var proxyquire =  require('proxyquire')

var BaseConversionDataSource,
  request;

//Base Tests
describe('BaseConversionDataSource', function() {

  beforeEach(function() {
    request = sinon.stub();
    BaseConversionDataSource = proxyquire('../data/BaseConversionDataSource', {
      'request-promise': request
    });
  })

  describe('fetchCurrencyConversionData', function() {
    it('Should call the the dataURL for fetching conversion data', function() {
      var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test.com");

      assert(request.get.calledWithMatch({ uri: "http://test.com" }));
    });
  });
});