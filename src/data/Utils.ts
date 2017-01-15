import * as fs from "fs";
import * as Q from "q";
import {HistoryLog} from "../PricePeg";
import {config} from "../config";

export const getDeepValue = (obj: any, path:string) => {
  for (let i=0, pathParts=path.split('.'), len=pathParts.length; i<len; i++){
    obj = obj[pathParts[i]];
  }

  return obj;
};

export const getHumanDate = (time: number): string => {
  // Create a new JavaScript Date object based on the timestamp
  let date = new Date(time);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};

export const logPegMessage = (msg, includeTimeStamp: boolean = true) => {
  msg = includeTimeStamp ? new Date() + " - " + msg  : msg;
  console.log(msg);
  writeToFile(config.debugLogFilename, msg + "\n");
};

export const writeToFile = (filePath: string, content: string, append: boolean = true) => {
  let deferred = Q.defer();

  if(append) {
    fs.appendFile(filePath, content, (err) => {
      if (err) {
        console.log(`ERROR WRITING TO FILE ${JSON.stringify(err)}`);
        deferred.reject(err);
      }

      deferred.resolve(content);
    });
  }else{
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(`ERROR WRITING TO FILE  ${JSON.stringify(err)}`);
        deferred.reject(err);
      }

      deferred.resolve(content);
    });
  }

  return deferred.promise;
};

export const readFromFile = (filePath: string): Q.IPromise<string> => {
  let deferred = Q.defer();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`ERROR READING FROM FILE  ${JSON.stringify(err)}`);
      deferred.reject(err);
    }

    deferred.resolve(data);
  });

  return deferred.promise;
};

//super simple test to see if the data in the file is in the right format
export const validateUpdateHistoryLogFormat = (ratesHistory: HistoryLog): boolean => {
  if(ratesHistory.length &&
    typeof ratesHistory[0].date === 'number' &&
    typeof ratesHistory[0].value === 'object') {
      return true;
  }

  return false;
};

export const logPegMessageNewline = () => {
  this.logPegMessage("", false);
};

export const getFiatExchangeRate = (usdRate, conversionRate, precision) => {
  let rate = usdRate / conversionRate;

  return getFixedRate(rate, precision);
};

export const getFixedRate = (rate, precision) => {
  return parseFloat(parseFloat(rate).toFixed(precision));
};

export const getPercentChange = (newRate, oldRate) => {
  if (newRate != oldRate) { //calc % change
    return  ((newRate - oldRate) / oldRate) * 100;
  }
  return 0;
};

export default getDeepValue;
