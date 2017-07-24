Number.isFinite = Number.isFinite || function(value) {
  return typeof value === 'number' && isFinite(value);
}

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number'
    && Number.isFinite(value)
    && !(value % 1);
};