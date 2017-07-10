import 'pixi.js';
import onResize from './onResize';
import background from './background';
import picture from './picture';

const $wrapper = $('.' + canvas_wrapper);

const app = new PIXI.Application({preserveDrawingBuffer: true});
$wrapper.append(app.view);
background(app);
picture(app);
window.app = app;

onResize(( width, height ) => app.renderer.resize(width, height));

export default () => app;