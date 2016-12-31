let sinon = require('sinon');
let when = require('when');
let assert = require('assert');
let rewire = require('rewire');

let rp = require('request-promise');
let PricePeg = rewire('../PricePeg');
let BaseConversionDataSource = rewire('../data/BaseConversionDataSource');

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
    let conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");
    let handlerSpy = sinon.spy(conversionDataSource, "formatCurrencyConversionData");

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