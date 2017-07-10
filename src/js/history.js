const re = /([^&=]+)=([^&]*)/g;

export const setParam = ( name, value ) => {
  const queryParameters = {};
  const queryString = location.search.substring(1);
  let m;
  while (m = re.exec(queryString)) {
    queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  queryParameters[name] = value;
  history.replaceState(null, null, location.pathname + '?' + $.param(queryParameters))
};

export const getParam = ( name ) => {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === name)  return pair[1];
  }
  return null;
};
