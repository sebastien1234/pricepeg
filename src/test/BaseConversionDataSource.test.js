var sinon = require('sinon');
var rewire = require('rewire');
var when = require('when');
var assert = require('assert');

var rp = require('request-promise');
var BaseConversionDataSource = rewire('../data/BaseConversionDataSource');

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

  it('Should properly manage the pendingRequest flag', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    assert.equal(conversionDataSource.pendingRequest, false);

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert.equal(conversionDataSource.pendingRequest, false);

      done();
    });

    assert.equal(conversionDataSource.pendingRequest, true);
  });

  it('Should properly manage lastFetchAttemptTime and lastSuccessfulFetchTime', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    //store times before fetch
    var prevAttemptTime = conversionDataSource.lastFetchAttemptTime;
    var prevSuccessTime = conversionDataSource.lastSuccessfulFetchTime;

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert(conversionDataSource.lastSuccessfulFetchTime > prevSuccessTime, "Properly set last success time");

      done();
    });

    assert(conversionDataSource.lastFetchAttemptTime > prevAttemptTime, "Properly set last attempt time");
  });
});

describe('rawCurrencyConversionData', function () {

  beforeEach(function (done) {
    sinon.stub(rp, 'get').returns(when("hello"));
    done();
  });

  afterEach(function (done) {
    rp.get.restore();
    done();
  });

  it('Should store the raw data response', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert.equal(conversionDataSource.rawCurrencyConversionData, "hello");
      done();
    });
  });

})