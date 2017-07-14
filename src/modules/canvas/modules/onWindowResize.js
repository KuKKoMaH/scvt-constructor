// import _throttle from 'lodash/throttle';
// import _debounce from 'lodash/debounce';
import config from './config';

const events = [];

const $window = $(window);
const $wrapper = $('.' + canvas_wrapper);
let width = null;
let height = null;

const resize = () => {
  width = $wrapper.width();
  height = $wrapper.height();

  const cRatio = width / height;
  const bgRatio = config.BACKGROUND_WIDTH / config.BACKGOUND_HEIGHT;
  const scale = (cRatio > bgRatio)
    ? width / config.BACKGROUND_WIDTH
    : height / config.BACKGOUND_HEIGHT;

  events.forEach(cb => cb(width, height, scale));
};
// const resize = _debounce(_throttle(() => {
//   width = $wrapper.width();
//   height = $wrapper.height();
//   events.forEach(cb => cb(width, height));
// }, 1000 / 60), 100);
$window.resize(resize);
window.onorientationchange = resize;
resize();

export default ( cb ) => {
  events.push(cb);
  cb(width, height);
}

export const getSize = () => ({ width, height });