const events = [];
const $window = $(window);
const $wrapper = $('.' + canvas_wrapper);
let width = null;
let height = null;

const resize = () => {
  width = $wrapper.width();
  height = $wrapper.height();
  events.forEach(cb => cb(width, height));
};

$window.resize(resize);
window.onorientationchange = resize;
resize();

export default ( cb ) => {
  events.push(cb);
  cb(width, height);
}
