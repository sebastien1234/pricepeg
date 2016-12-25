import CurrencyConversion from "./CurrencyConversion";
let rp = require('request-promise');
let Q = require('q');

export default class BaseConversionDataSource {

  public rawCurrencyConversionData: any;
  public formattedCurrencyConversionData: CurrencyConversion & any;
  public lastFetchAttemptTime: number = 0;
  public lastSuccessfulFetchTime: number = 0;

  constructor(public baseCurrencySymbol: string, public baseCurrencyLabel: string, public dataUrl: string, public responseDataPath: string = null) {
    this.dataUrl = dataUrl;
    this.baseCurrencySymbol = baseCurrencySymbol;
    this.baseCurrencyLabel = baseCurrencyLabel;
    this.responseDataPath = responseDataPath;
  }

  formatCurrencyConversionData = (rawCurrencyResponseData: any) => {
    //convert the raw currency conversion data to a standard format, may differ by datasource
    console.log("Handling response in base data source handler.");

    return null; //this should be overridden!
  };

  fetchCurrencyConversionData = () => {
    //console.log("Fetching currency data from: " + this.baseCurrencyLabel + " - " + this.baseCurrencySymbol + " => " + this.dataUrl);

    this.lastFetchAttemptTime = Date.now();

    let deferred = Q.defer();

    rp.get({
      uri: this.dataUrl,
      json: true
    }).then((parsedBody) => {
        this.handleFetchCurrencyConversionData(parsedBody);
        deferred.resolve();
    })
    .catch((err) => { // if rp.get rejects (e.g. 500), do this:
      console.log("Error requesting data.", err);
      deferred.reject(err);
    });

    return deferred.promise;
  };

  handleFetchCurrencyConversionData = (response: any) => {
    this.rawCurrencyConversionData = response;
    this.lastSuccessfulFetchTime = Date.now();

    console.log(this.dataUrl + " returned!");

    this.formatCurrencyConversionData(this.rawCurrencyConversionData);
  };

}

