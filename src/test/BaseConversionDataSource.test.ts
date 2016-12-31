import sinon = require("sinon");
import rewire = require('rewire');
import when = require('when');
import assert = require('assert');
import rp  = require('request-promise');

let RewiredComponent = rewire('../data/BaseConversionDataSource');
let defaultComponentMock = {};


// let defaultMock = { /* Make a mock of your dependency */ };
// RewiredComponent.__set__('other_component_1', {
//   default: defaultComponentMock
// });
//
// let individuallyExportedMock = { /* Make a mock of your dependency */ };
// RewiredComponent.__set__('yet_another_component_1', {
//   IndividuallyExportedComponent: individuallyExportedMock
// });

// RewiredComponent has the wrong type now. YMMV, but I'm doing type-wrangling
// that looks something like:

import BaseConversionDataSource from "../data/BaseConversionDataSource";
let Component: typeof BaseConversionDataSource & typeof RewiredComponent = <any> RewiredComponent;

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
    let conversionDataSource = new Component("TSYS", "Test", "http://test2.com");
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

  it('Should properly manage lastFetchAttemptTime and lastSuccessfulFetchTime', function (done) {
    let conversionDataSource = new Component("TSYS", "Test", "http://test2.com");

    //store times before fetch
    let prevAttemptTime = conversionDataSource.lastFetchAttemptTime;
    let prevSuccessTime = conversionDataSource.lastSuccessfulFetchTime;

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
    let conversionDataSource = new Component("TSYS", "Test", "http://test2.com");

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert.equal(conversionDataSource.rawCurrencyConversionData, "hello");
      done();
    });
  });

});