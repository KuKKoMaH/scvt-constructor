const BORDER_OFFSET = 2;
const BORDER_WIDTH = 4;

const listeners = [];

export default () => {
  let lastPosition = null;

  const border = new PIXI.Graphics();
  border.zIndex = 102;
  border.interactive = true;
  border.buttonMode = true;
  border.cursor = 'nwse-resize';

  border
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  function onDragStart(event) {
    this.data = event.data;
    // this.alpha = 0.5;
    this.dragging = true;
    lastPosition = [event.data.global.x, event.data.global.y];
  }

  function onDragEnd() {
    // this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  function onDragMove(event) {
    // console.log(event.data);
    if (this.dragging) {
      const x = event.data.global.x;
      const y = event.data.global.y;
      const offsetX = lastPosition[0] - x;
      const offsetY = lastPosition[1] - y;
      console.log(offsetX, offsetY);
      lastPosition = [x, y];
      listeners.forEach(cb => cb(offsetX, offsetY));
    }
  }

  return border;
};

export const onResize = cb => listeners.push(cb);

export const positionateBorder = (border, picture) => {
  const { x, y, width, height } = picture;
  border.clear();
  border.beginFill(0, 0.3);

  // Верхняя граница
  border.drawRect(
    x - width / 2 - BORDER_OFFSET - BORDER_WIDTH,
    y - height / 2 - BORDER_OFFSET - BORDER_WIDTH,
    width + BORDER_OFFSET * 2 + BORDER_WIDTH * 2,
    BORDER_WIDTH
  );

  // Левая
  border.drawRect(
    x - width / 2 - BORDER_OFFSET - BORDER_WIDTH,
    y - height / 2 - BORDER_OFFSET,
    BORDER_WIDTH,
    height + BORDER_WIDTH
  );

  // Правая
  border.drawRect(
    x + width / 2 + BORDER_OFFSET,
    y - height / 2 - BORDER_OFFSET,
    BORDER_WIDTH,
    height + BORDER_WIDTH
  );

  // Нижняя
  border.drawRect(
    x - width / 2 - BORDER_OFFSET - BORDER_WIDTH,
    y + height / 2 + BORDER_OFFSET,
    width + BORDER_OFFSET * 2 + BORDER_WIDTH * 2,
    BORDER_WIDTH
  );
};
