import './DropShadowFilter';
import sortChildren from './sortChildren';
import pictureMove, { onMove } from './pictureMove';
import loadMask from './loadMask';
import PictureBorder from './PictureBorder';

const PIXELS_IN_CENTIMETRE = window.PIXELS_IN_CENTIMETRE || 3.5; // кол-во пикселей в 1 см при масштабе 1
const MINIMAL_WIDTH = 5;
let pixelsInCentimetre = null; // кол-во пикселей в 1 см при текущем масштабе
let pictureSize = window.PICTURE_SIZE || 70; // размер картины в см
let pictureX = window.PICTURE_X || 0; // смещение относильно центра в см
let pictureY = window.PICTURE_Y || 0;
let ratio = 1;

let picture = null;
let mask = null;

let maskScale = 1;
let pictureScale = 1;

export default class Picture {
  constructor(app) {
    this.app = app;
    this.picture = null;
    this.mask = null;

    this.border = this.createBorder();
    this.drawChildren(this.border.getContainer());

    // onChangeScale(( scale ) => {
    //   pixelsInCentimetre = getPixelsInCentimetre(scale);
    // });

    // onMove((offsetX, offsetY) => {
    //   const x = picture.x - offsetX;
    //   const y = picture.y - offsetY;
    //   pictureX = (app.renderer.width / 2 - x) / pixelsInCentimetre;
    //   pictureY = (app.renderer.height / 2 - y) / pixelsInCentimetre;
    //   positionate(); // при драге мышкой без этого картина драгается с замедлением
    // });

    // app.ticker.add(positionate);

    // function positionate() {
    //   if (!picture) return;
    //
    //   const pic = mask || picture;
    //   let picScale = pic === mask ? maskScale : pictureScale;
    //   ratio = pic.height / pic.width;
    //
    //   picScale = pictureSize * pixelsInCentimetre / pic.height * picScale;
    //   pic.scale = new PIXI.Point(picScale, picScale);
    //
    //   if (pic === mask) {
    //     maskScale = picScale;
    //     pictureScale = mask.width <= mask.height
    //       ? mask.height / picture.height * pictureScale
    //       : mask.width / picture.width * pictureScale;
    //     picture.scale = new PIXI.Point(pictureScale, pictureScale);
    //   } else {
    //     pictureScale = picScale;
    //   }
    //
    //   let x = app.renderer.width / 2 - (pictureX * pixelsInCentimetre);
    //   let y = app.renderer.height / 2 - (pictureY * pixelsInCentimetre);
    //
    //   const halfWidth = pic.width / 2;
    //   const halfHeight = pic.height / 2;
    //   if (x - halfWidth < 0) x = halfWidth;
    //   if (x + halfWidth > app.renderer.width) x = app.renderer.width - halfWidth;
    //   if (y - halfHeight < 0) y = halfHeight;
    //   if (y + halfHeight > app.renderer.height) y = app.renderer.height - halfHeight;
    //
    //   picture.x = x;
    //   picture.y = y;
    //   if (mask) {
    //     mask.x = x;
    //     mask.y = y;
    //   }
    //
    //   border.positionate(pic);
    // }
  }

  setPicture(item) {
    const stage = this.app.stage;
    if (this.picture) stage.removeChild(this.picture);
    if (this.mask) stage.removeChild(this.mask);

    const picture = PIXI.Sprite.fromImage(item.full);
    picture.anchor.set(0.5);

    if (item.mask) {
      loadMask(item.mask, newMask => {
        const mask = newMask;
        mask.zIndex = 101;
        mask.x = app.renderer.width / 2;
        mask.y = app.renderer.height / 2;
        this.drawChildren(mask);
        // picture.mask = mask;
        // this.mask = mask;
      });
    } else {
      this.mask = null;
    }

    const filter = new PIXI.filters.DropShadowFilter(45, 5, 10, 0x000, .3);
    picture.filters = [filter];
    picture.zIndex = 100;

    // pictureMove(app, picture);

    this.drawChildren(picture);
    this.picture = picture;

  }

  createBorder() {
    const border = new PictureBorder();
    const onResize = [
      null,
      (offsetInSm) => { // Верхняя
        pictureSize -= offsetInSm;
        pictureY = pictureY - offsetInSm / 2;
      },
      (offsetInSm) => { // Правая
        pictureSize += offsetInSm * ratio;
        pictureX = pictureX - offsetInSm / 2;
      },
      (offsetInSm) => { // Нижняя
        pictureSize += offsetInSm;
        pictureY = pictureY - offsetInSm / 2;
      },
      (offsetInSm) => { // Левая
        pictureSize -= offsetInSm * ratio;
        pictureX = pictureX - offsetInSm / 2;
      },
    ];
    border.onResize((side, offset) => {
      onResize[side](offset / pixelsInCentimetre);
      if (pictureSize < MINIMAL_WIDTH) pictureSize = MINIMAL_WIDTH;
      positionate();
    });
    return border;
  }

  drawChildren(children) {
    const app = this.app;
    app.stage.addChild(children);
    sortChildren(app);
  }
}

export const getPixelsInCentimetre = (scale) => scale * PIXELS_IN_CENTIMETRE;
