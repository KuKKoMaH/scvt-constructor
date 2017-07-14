import 'pixi.js';
import './background';
import onWindowResize from './onWindowResize';
import Picture from './Picture';

const $wrapper = $('.' + canvas_wrapper);

const app = new PIXI.Application({ preserveDrawingBuffer: true, transparent: true });
$wrapper.append(app.view);
onWindowResize((width, height) => app.renderer.resize(width, height));
window.app = app;

const picture = new Picture(app);

$('body').on('picture:change', (e, item) => {
  console.log(item);
  if (!item) return;
  picture.setPicture(item);
});

export default () => app;