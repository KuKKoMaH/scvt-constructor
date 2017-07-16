import 'pixi.js';
import Promise from 'bluebird';
import loadImage from '../canvas/modules/utils/loadImage';
import loadMask from '../canvas/modules/utils/loadMask';

const app = new PIXI.Application({ preserveDrawingBuffer: true, transparent: true });
// $('body').append(app.view);

export default ( imageUrl, maskUrl, width, height ) => {
  const cRatio = width / height;
  return Promise.all([
    imageUrl && loadImage(imageUrl),
    maskUrl && loadMask(maskUrl)
  ]).then(( [imageTexture, mask] ) => {
    app.renderer.resize(width, height);

    let picture = null;
    if (imageTexture) {
      picture = PIXI.Sprite.from(imageTexture);
      picture.anchor.set(0.5);
      picture.x = width / 2;
      picture.y = height / 2;
      const picRatio = picture.width / picture.height;
      const condition = mask ? cRatio > picRatio : cRatio < picRatio;
      const pictureScale = condition
        ? width / picture.width
        : height / picture.height;
      picture.scale = new PIXI.Point(pictureScale, pictureScale);
      app.stage.addChild(picture);
    }

    if (mask) {
      const maskRatio = mask.width / mask.height;
      const maskScale = (cRatio < maskRatio)
        ? width / mask.width
        : height / mask.height;
      mask.x = width / 2;
      mask.y = height / 2;
      mask.scale = new PIXI.Point(maskScale, maskScale);
      if (picture) picture.mask = mask;
      app.stage.addChild(mask);
    }

    app.render();
    const dataURL = app.renderer.view.toDataURL();
    if (picture) {
      app.stage.removeChild(picture);
      picture.destroy();
    }
    if (mask) {
      app.stage.removeChild(mask);
      mask.destroy();
    }
    return dataURL;
  })
}