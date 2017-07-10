import onResize, { getSize } from './onResize';
import sortChildren from './sortChildren';

let bg = null;
let scale = 1;
const listeners = [];
// const bgGroup = new PIXI.display.Group(0, true)

export default ( app ) => {
  $('body').on('background:change', ( e, item ) => {
    if (!item) return;
    if (bg) app.stage.removeChild(bg);

    bg = new PIXI.Sprite.fromImage(item.item.full);
    bg.zIndex = 1;
    app.stage.addChild(bg);
    sortChildren(app);
  });

  app.ticker.add(positionate);

  function positionate() {
    if (!bg) return;

    const cWidth = app.renderer.width;
    const cHeight = app.renderer.height;
    const bgWidth = bg.width / scale;
    const bgHeight = bg.height / scale;

    const winratio = cWidth / cHeight;
    const spratio = bgWidth / bgHeight;
    const pos = new PIXI.Point(0, 0);
    let newScale;

    if (winratio > spratio) {
      //photo is wider than background
      newScale = cWidth / bgWidth;
      pos.y = -((bgHeight * newScale) - cHeight) / 2;
    } else {
      //photo is taller than background
      newScale = cHeight / bgHeight;
      pos.x = -((bgWidth * newScale) - cWidth) / 2;
    }
    bg.scale = new PIXI.Point(newScale, newScale);
    bg.position = pos;

    if (scale !== newScale) {
      scale = newScale;
      listeners.forEach(cb => cb(scale));
    }
  }
}

export const getScale = () => scale;
export const onChangeScale = cb => listeners.push(cb);
