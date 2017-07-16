import 'pixi.js';
import config from './config';
import onWindowResize from './utils/onWindowResize';
import Background from './Background';
import Picture from './Picture';

export default class App {
  constructor() {
    const app = new PIXI.Application({ preserveDrawingBuffer: true, transparent: true });
    const $wrapper = $('.' + canvas_wrapper);
    $wrapper.append(app.view);

    const background = new Background({ app });
    app.stage.addChild(background.container);

    const picture = new Picture({
      app,
      pictureX:    config.PICTURE_X,
      pictureY:    config.PICTURE_Y,
      pictureSize: config.PICTURE_SIZE,
    });
    app.stage.addChild(picture.container);

    this.app = app;
    this.picture = picture;
    this.background = background;

    this.scale = null;

    $('body')
      .on('picture:change', ( e, item ) => this._onChangePicture(item))
      .on('background:change', ( e, item ) => this._onBackgroundChange(item));

    onWindowResize(this._onResize.bind(this));
  }

  takeScreenshot() {
    return this.app.renderer.view.toDataURL();
  }

  _onChangePicture( item ) {
    console.log(item);
    if (!item) return;
    // console.log(picture.picture)
    this.picture.setPicture(item);
  }

  _onBackgroundChange( item ) {
    if (!item) return;
    this.background.setImage(item.item.full, this.app.renderer.width, this.app.renderer.height)
      .then(this._calcScale.bind(this));
  }

  _onResize( width, height ) {
    this.app.renderer.resize(width, height);
    this._calcScale();
  }

  _calcScale() {
    const { app: { renderer }, background: { width, height } } = this;

    const cRatio = renderer.width / renderer.height;
    const bgRatio = width / height;
    const scale = (cRatio > bgRatio)
      ? renderer.width / width
      : renderer.height / height;
    if (!Number.isFinite(scale)) return;
    console.log('scale', scale);
    this.scale = scale;
    this.picture.setScale(scale);
    this.background.setScale(scale);
  }
}
