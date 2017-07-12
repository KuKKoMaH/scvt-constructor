let lastPosition = null;
const listeners = [];

export default ( app, picture ) => {
  lastPosition = [app.renderer.width / 2, app.renderer.height / 2];

  picture
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  picture.interactive = true;
  picture.buttonMode = true;

  function onDragStart( event ) {
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

  function onDragMove( event ) {
    if (this.dragging) {
      const x = event.data.global.x;
      const y = event.data.global.y;
      const offsetX = lastPosition[0] - x;
      const offsetY = lastPosition[1] - y;
      if (!offsetX && !offsetY) return;
      lastPosition = [x, y];
      listeners.forEach(cb => cb(offsetX, offsetY));
    }
  }
}

export const onMove = cb => listeners.push(cb);