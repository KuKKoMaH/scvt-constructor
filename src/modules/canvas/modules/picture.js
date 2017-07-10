import './DropShadowFilter';
import sortChildren from './sortChildren';
import { onChangeScale } from './background';
import pictureMove, { onMove } from './pictureMove';
import drawMask from './mask';

const PIXELS_IN_CENTIMETRE = 3.5;
let pictureWidth = 70;
let pictureX = 0;
let pictureY = 0;
let picture = null;
let mask = null;
let maskScale = 1;
let pictureScale = 1;
let pixelsInCentimetre = null;

export default ( app ) => {
  $('body').on('picture:change', ( e, item ) => {
    console.log(item);
    if (!item) return;
    if (picture) app.stage.removeChild(picture);
    if (mask) app.stage.removeChild(mask);

    picture = PIXI.Sprite.fromImage(item.full);
    picture.anchor.set(0.5);

    drawMask(app, item.mask, newMask => {
      mask = newMask;
      mask.zIndex = 101;
      mask.x = app.renderer.width / 2;
      mask.y = app.renderer.height / 2;
      app.stage.addChild(mask);
      sortChildren(app);

      picture.mask = mask;
    });

    const filter = new PIXI.filters.DropShadowFilter(45, 5, 10, 0x000, .3);
    picture.filters = [filter];
    picture.zIndex = 100;

    pictureMove(app, picture);

    app.stage.addChild(picture);
    sortChildren(app);
  });

  onChangeScale(( scale ) => {
    pixelsInCentimetre = getPixelsInCentimetre(scale);
  });

  onMove(( offsetX, offsetY ) => {
    const x = picture.x - offsetX;
    const y = picture.y - offsetY;
    pictureX = (app.renderer.width / 2 - x) / pixelsInCentimetre;
    pictureY = (app.renderer.height / 2 - y) / pixelsInCentimetre;
  });

  app.ticker.add(positionate);

  function positionate() {
    if (!picture || !mask) return;

    pictureScale = pictureWidth * pixelsInCentimetre / picture.width * pictureScale;
    picture.scale = new PIXI.Point(pictureScale, pictureScale);

    maskScale = picture.width > picture.height
      ? picture.height / mask.height * maskScale
      : picture.width / mask.width * maskScale;
    mask.scale = new PIXI.Point(maskScale, maskScale);

    const x = app.renderer.width / 2 - (pictureX * pixelsInCentimetre);
    const y = app.renderer.height / 2 - (pictureY * pixelsInCentimetre);
    picture.x = x;
    picture.y = y;
    mask.x = x;
    mask.y = y;
  }
}

export const getPixelsInCentimetre = ( scale ) => scale * PIXELS_IN_CENTIMETRE;
