export const getDeepValue = (obj, path:string) => {
  for (let i=0, pathParts=path.split('.'), len=pathParts.length; i<len; i++){
    obj = obj[pathParts[i]];
  };

  return obj;
};

export default getDeepValue;
