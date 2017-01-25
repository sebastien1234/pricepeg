//TODO: this test is work in progress.
// xdescribe('fetchCurrencyConversionData', function () {
//
//   beforeEach(function (done) {
//     sinon.stub(rp, 'get').returns(when({}));
//     done();
//   });
//
//   afterEach(function (done) {
//     rp.get.restore();
//     done();
//   });
//
//   it('Should call the dataURL and base callback', (done) => {
//     let rewire = require('rewire');
//     let PricePeg = rewire('../PricePeg.js');
//     let BaseConversionDataSource = rewire('../data/BaseConversionDataSource.js');
//
//     let conversionDataSource = new BaseConversionDataSource("TSYS", "Test", "http://test2.com");
//     let handlerSpy = sinon.spy(conversionDataSource, "formatCurrencyConversionData");
//
//     conversionDataSource.fetchCurrencyConversionData().then(function () {
//       sinon.assert.calledOnce(handlerSpy);
//       sinon.assert.calledWith(rp.get, {
//         uri: "http://test2.com",
//         json: true
//       });
//
//       done();
//     });
//   });
// });