import * as sinon from 'sinon';
import * as when from 'when';
import * as assert from 'assert';
import * as rewire from 'rewire';
import * as rp from 'request-promise'

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

  it('Should properly manage lastFetchAttemptTime and lastSuccessfulFetchTime', function (done) {
    let conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

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
    let conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");

    conversionDataSource.fetchCurrencyConversionData().then(function () {
      assert.equal(conversionDataSource.rawCurrencyConversionData, "hello");
      done();
    });
  });

});