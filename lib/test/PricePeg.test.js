var sinon = require('sinon');
var when = require('when');
var assert = require('assert');

var rp = require('request-promise');
var PricePeg = rewire('../PricePeg');

describe('fetchCurrencyConversionData', function () {

  beforeEach(function (done) {
    sinon.stub(rp, 'get').returns(when({}));
    done();
  });

  afterEach(function (done) {
    rp.get.restore();
    done();
  });

  it('Should call the dataURL and base callback', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");
    var handlerSpy = sinon.spy(conversionDataSource, "formatCurrencyConversionData");

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      sinon.assert.calledOnce(handlerSpy);
      sinon.assert.calledWith(rp.get, {
        uri: "http://test2.com",
        json: true
      });

      done();
    });
  });
})