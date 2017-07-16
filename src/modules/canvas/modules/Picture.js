import Promise from 'bluebird';
import './DropShadowFilter';
import sortChildren from './utils/sortChildren';
import onMove from './utils/pictureMove';
import loadMask from './utils/loadMask';
import loadImage from './utils/loadImage';
import PictureBorder from './PictureBorder';
import config from './config';

export default class Picture {
  constructor( { app, pictureX, pictureY, pictureSize, } ) {
    this.app = app;
    this.pictureX = pictureX || 0;
    this.pictureY = pictureY || 0;
    this.pictureSize = pictureSize || 70;

    this.scale = null;
    this.ratio = null;
    this.pixelsInCentimetre = null;

    this.container = new PIXI.Container();
    this.shadowFilter = new PIXI.filters.DropShadowFilter(45, 5, 10, 0x000, .3);
    this.picture = null;
    this.mask = null;

    this.border = this.createBorder();
    this.drawChildren(this.border.getContainer());
  }

  _createPicture( url ) {
    if (!url) return null;
    return loadImage(url).then(( texture ) => {
      const picture = PIXI.Sprite.from(texture);
      picture.anchor.set(0.5);
      picture.filters = [this.shadowFilter];
      picture.zIndex = 100;
      picture.interactive = true;
      picture.buttonMode = true;

      onMove(picture, this.onMove.bind(this));

      return picture;
    });
  }

  _createMask( url ) {
    if (!url) return null;
    return loadMask(url).then(( mask ) => {
      mask.zIndex = 101;
      return mask;
    })
  }

  _bindMaskUpload( mask ) {
    mask.interactive = true;
    mask.buttonMode = true;
    mask.on('pointertap', () => $('.' + slider_upload + ' input[type="file"]').click());
  }

  setScale( scale ) {
    this.scale = scale;
    this.pixelsInCentimetre = scale * config.PIXELS_IN_CENTIMETRE;
    this.positionate();
  }

  setPicture( item ) {
    const container = this.container;

    Promise.all([
      this._createPicture(item.full),
      this._createMask(item.mask),
    ]).then(( [picture, mask] ) => {
      if (this.picture) {
        container.removeChild(this.picture);
        this.picture.destroy();
      }
      if (this.mask) {
        container.removeChild(this.mask);
        this.mask.destroy();
      }

      this.picture = picture;
      if (picture) this.drawChildren(picture);

      if (mask) {
        this.drawChildren(mask);
        if (picture) {
          picture.mask = mask;
        } else {
          this._bindMaskUpload(mask);
        }
        this.mask = mask;
        this.ratio = mask.width / mask.height;
      } else {
        this.mask = null;
        this.ratio = picture.width / picture.height;
      }

      this.positionate();
    });
  }

  onMove( offsetX, offsetY ) {
    const x = this.picture.x - offsetX;
    const y = this.picture.y - offsetY;
    this.pictureX = (this.app.renderer.width / 2 - x) / this.pixelsInCentimetre;
    this.pictureY = (this.app.renderer.height / 2 - y) / this.pixelsInCentimetre;
    this.positionate();
  };

  /**
   *
   * @param {[1,2,3,4]} side - сторона смещения: [верх, право, низ, лево]
   * @param {number} offset - дистанция с мещения в пх
   */
  onResize( side, offset ) {
    const { pixelsInCentimetre, pictureX, pictureY, pictureSize } = this;
    const onResize = [
      null,
      ( offsetInSm ) => { // Верхняя
        this.pictureSize -= offsetInSm;
        this.pictureY = pictureY - offsetInSm / 2;
      },
      ( offsetInSm ) => { // Правая
        this.pictureSize += offsetInSm / this.ratio;
        this.pictureX = pictureX - offsetInSm / 2;
      },
      ( offsetInSm ) => { // Нижняя
        this.pictureSize += offsetInSm;
        this.pictureY = pictureY - offsetInSm / 2;
      },
      ( offsetInSm ) => { // Левая
        this.pictureSize -= offsetInSm / this.ratio;
        this.pictureX = pictureX - offsetInSm / 2;
      },
    ];
    onResize[side](offset / pixelsInCentimetre);
    if (pictureSize < config.MINIMAL_SIZE) this.pictureSize = config.MINIMAL_SIZE;
    this.positionate();
  }

  positionate() {
    const { app, picture, mask, border, pixelsInCentimetre, pictureX, pictureY, pictureSize } = this;
    if (!pixelsInCentimetre) return;
    if (!picture && !mask) return;

    if (mask) {
      const maskScale = pictureSize * pixelsInCentimetre / mask.height * mask.scale.y;
      mask.scale = new PIXI.Point(maskScale, maskScale);

      if (picture) {
        const pictureScale = mask.width <= mask.height
          ? mask.height / picture.height * picture.scale.y
          : mask.width / picture.width * picture.scale.y;
        picture.scale = new PIXI.Point(pictureScale, pictureScale);
      }
    } else {
      const pictureScale = pictureSize * pixelsInCentimetre / picture.height * picture.scale.y;
      picture.scale = new PIXI.Point(pictureScale, pictureScale);
    }

    const pic = mask || picture;
    let x = app.renderer.width / 2 - (pictureX * pixelsInCentimetre);
    let y = app.renderer.height / 2 - (pictureY * pixelsInCentimetre);

    // При выходе за границы экрана возвращать в область видимости
    const halfWidth = pic.width / 2;
    const halfHeight = pic.height / 2;
    if (x - halfWidth < 0) x = halfWidth;
    if (x + halfWidth > app.renderer.width) x = app.renderer.width - halfWidth;
    if (y - halfHeight < 0) y = halfHeight;
    if (y + halfHeight > app.renderer.height) y = app.renderer.height - halfHeight;

    if (picture) {
      picture.x = x;
      picture.y = y;
    }
    if (mask) {
      mask.x = x;
      mask.y = y;
    }
    border.positionate(pic);
  }

  createBorder() {
    const border = new PictureBorder();
    border.onResize(this.onResize.bind(this));
    return border;
  }

  drawChildren( children ) {
    const container = this.container;
    container.addChild(children);
    sortChildren(container);
  }
}
