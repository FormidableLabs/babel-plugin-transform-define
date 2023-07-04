const obj = {
    __DEV__
  };
  const obj1 = {
    __DEV__: "test"
  };
  const obj2 = {
    __DEV__: __DEV__
  };
  const obj3 = {
    "__DEV__": __DEV__
  };
  const obj4 = {
    ["__DEV__"]: __DEV__
  };
  
  const obj5 = {
    [__DEV__]: __DEV__
  };
  
  const obj6 = {
    [__DEV2__]: __DEV2__
  };