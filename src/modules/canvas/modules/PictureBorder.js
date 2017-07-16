const BORDER_OFFSET = 6;
const BORDER_WIDTH = 8;
const BORDER_OPACITY = .1;

export default class PictureBorder {
  constructor() {
    this.lastPosition = null;
    this.listeners = [];

    this.container = new PIXI.Container();
    this.container.zIndex = 102;
    this.container.alpha = BORDER_OPACITY;

    this.borders = [1, 2, 3, 4].map(i => this._createBorder(i));
  }

  _createBorder(i) {
    const that = this;
    const border = new PIXI.Graphics();
    border.interactive = true;
    border.buttonMode = true;
    border.cursor = i % 2 === 0 ? 'ew-resize' : 'ns-resize';
    border
      .on('mouseover', function () {
        this.over = true;
        that.container.alpha = .9;
      })
      .on('mouseout', function () {
        this.over = false;
        if (this.dragging) return;
        that.container.alpha = BORDER_OPACITY;
      })
      .on('pointerdown', function (event) {
        this.data = event.data;
        this.dragging = true;
        this.lastPosition = [event.data.global.x, event.data.global.y];
      })
      .on('pointerup', function () {
        if (!this.over) that.container.alpha = BORDER_OPACITY;
        this.dragging = false;
        this.data = null;
      })
      .on('pointerupoutside', function () {
        if (!this.over) that.container.alpha = BORDER_OPACITY;
        this.dragging = false;
        this.data = null;
      })
      .on('pointermove', function (event) {
        if (this.dragging) {
          const x = event.data.global.x;
          const y = event.data.global.y;
          const offsetX = x - this.lastPosition[0];
          const offsetY = y - this.lastPosition[1];
          if (!offsetX && !offsetY) return;

          this.lastPosition = [x, y];
          that.listeners.forEach(cb => cb(i, i % 2 === 0 ? offsetX : offsetY));
        }
      });

    this.container.addChild(border);
    return border;
  }

  _drawLine(border, isVertical, x0, y0, x1, y1) {
    border.clear();
    border.beginFill(0, 0);
    border.drawRect(
      x0 - BORDER_WIDTH,
      y0 - BORDER_WIDTH,
      x1 - x0 + BORDER_WIDTH * 2,
      y1 - y0 + BORDER_WIDTH * 2,
    );

    border.lineStyle(1, 0, 1);
    border.moveTo(x0, y0);
    if (isVertical) {
      let y = y0;
      while (y < y1) {
        y += 3;
        border.lineTo(x0, y);
        y += 3;
        border.moveTo(x0, y);
      }
    } else {
      let x = x0;
      while (x < x1) {
        x += 3;
        border.lineTo(x, y0);
        x += 3;
        border.moveTo(x, y0);
      }
    }
  }

  getContainer() {
    return this.container;
  }

  onResize(cb) {
    this.listeners.push(cb);
  }

  positionate(picture) {
    const { x, y, width, height } = picture;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Верхняя граница
    this._drawLine(this.borders[0], false,
      x - halfWidth - BORDER_OFFSET,
      y - halfHeight - BORDER_OFFSET,
      x + halfWidth + BORDER_OFFSET,
      y - halfHeight - BORDER_OFFSET,
    );

    // Правая
    this._drawLine(this.borders[1], true,
      x + halfWidth + BORDER_OFFSET,
      y - halfHeight - BORDER_OFFSET,
      x + halfWidth + BORDER_OFFSET,
      y + halfHeight + BORDER_OFFSET,
    );

    // Нижняя
    this._drawLine(this.borders[2], false,
      x - halfWidth - BORDER_OFFSET,
      y + halfHeight + BORDER_OFFSET,
      x + halfWidth + BORDER_OFFSET,
      y + halfHeight + BORDER_OFFSET,
    );

    // Левая
    this._drawLine(this.borders[3], true,
      x - halfWidth - BORDER_OFFSET,
      y - halfHeight - BORDER_OFFSET,
      x - halfWidth - BORDER_OFFSET,
      y + halfHeight + BORDER_OFFSET,
    );
  }
};