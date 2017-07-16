import Promise from 'bluebird';
import loadImage from './utils/loadImage';

export default  class Background {
  constructor({app}) {
    this.app = app;
    this.container = new PIXI.Container();
    this.image = null;

    this.src = null;
    this.width = null;
    this.height = null;
  }

  setScale( scale ) {
    const {image, app} = this;
    image.scale = new PIXI.Point(scale, scale);
    image.x = app.renderer.width / 2;
    image.y = app.renderer.height / 2;
  }

  setImage( src ) {
    if (src === this.src) return Promise.resolve();

    return loadImage(src).then(( texture ) => {
      const image = new PIXI.Sprite(texture);
      const prevImage = this.image;
      this.image = image;
      image.anchor.set(0.5);
      image.alpha = 0;
      this.container.addChild(image);

      this.src = src;
      this.width = image.texture.width;
      this.height = image.texture.height;

      this.fadeIn(image).then(() => {
        if (!prevImage) return;
        this.container.removeChild(prevImage);
        prevImage.destroy();
      });

      return null;
    });
  }

  fadeIn( image ) {
    if (!image) return Promise.resolve();

    return new Promise(( res ) => {
      const increaseAlpha = () => {
        image.alpha += .1;
        if (image.alpha >= 1) return res();
        requestAnimationFrame(increaseAlpha);
      };
      increaseAlpha();
    })
  }
}
