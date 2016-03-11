var sinon = require('sinon');
var rewire = require('rewire');
var when = require('when');
var assert = require('assert');

var rp = require('request-promise'),
  mockReturn = {};
var BaseConversionDataSource = rewire('../data/BaseConversionDataSource');

describe('BaseConversionDataSource', function () {

  before(function (done) {
    sinon.stub(rp, 'get').returns(when(mockReturn));
    done();
  });

  after(function (done) {
    rp.get.restore();
    done();
  });

  it('fetchCurrencyConversionData - Should call the dataURL and base callback', function (done) {
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

  it('fetchCurrencyConversionData - Should properly manage the pendingRequest flag', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    assert.equal(conversionDataSource.pendingRequest, false);

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert.equal(conversionDataSource.pendingRequest, false);

      done();
    });

    assert.equal(conversionDataSource.pendingRequest, true);
  });

  it('fetchCurrencyConversionData - Should properly manage lastFetchAttemptTime and lastSuccessfulFetchTime', function (done) {
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

  xit('fetchCurrencyConversionData - Should store the raw data response in rawCurrencyConversionData', function (done) {
    var conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      console.log("RETURN:" + JSON.stringify(conversionDataSource.rawCurrencyConversionData));
      assert.equal(conversionDataSource.rawCurrencyConversionData, {});

      done();
    });
  });

});