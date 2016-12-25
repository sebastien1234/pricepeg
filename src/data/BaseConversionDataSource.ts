let rp = require('request-promise');
let Q = require('q');

export default class BaseConversionDataSource {

  public rawCurrencyConversionData;
  public formattedCurrencyConversionData; //should always be of type CurrencyConversion for to/from 1
  public lastFetchAttemptTime = 0;
  public lastSuccessfulFetchTime = 0;
  public pendingRequest = false;

  constructor(public baseCurrencySymbol, public baseCurrencyLabel, public dataUrl, public responseDataPath = null) {
    this.dataUrl = dataUrl;
    this.baseCurrencySymbol = baseCurrencySymbol;
    this.baseCurrencyLabel = baseCurrencyLabel;
    this.responseDataPath = responseDataPath;
  }

  formatCurrencyConversionData = (rawCurrencyResponseData) => {
    //convert the raw currency conversion data to a standard format, may differ by datasource
    console.log("Handling response in base data source handler.");

    return null; //this should be overridden!
  };

  fetchCurrencyConversionData = () => {
    //console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);

    this.pendingRequest = true;
    this.lastFetchAttemptTime = Date.now();

    let deferred = Q.defer();

    rp.get({
      uri: this.dataUrl,
      json: true
    }).then((parsedBody) => {
        this.pendingRequest = false;
        this.handleFetchCurrencyConversionData(parsedBody);
        deferred.resolve();
    })
    .catch((err) => { // if rp.get rejects (e.g. 500), do this:
      this.pendingRequest = false;
      console.log("Error requesting data.", err);
      deferred.reject(err);
    });

    return deferred.promise;
  };

  handleFetchCurrencyConversionData = (response) => {
    this.rawCurrencyConversionData = response;
    this.lastSuccessfulFetchTime = Date.now();

    console.log(this.dataUrl + " returned!");

    this.formatCurrencyConversionData(this.rawCurrencyConversionData);
  };

}

