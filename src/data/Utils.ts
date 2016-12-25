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

export default getDeepValue;
