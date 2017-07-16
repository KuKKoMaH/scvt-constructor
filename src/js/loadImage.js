const cache = {};
const img = new Image();

export default (src, cb) => {
  if (cache[src]) return cb(cache[src]);
  img.onload = function () {
    cache[src] = {
      src:    this.src,
      width:  this.width,
      height: this.height,
    };
    cb(cache[src]);
  };
  img.src = src;
}