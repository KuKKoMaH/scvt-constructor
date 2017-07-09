import canvg from './canvg';

const drawBg = ( canvas, $bg, cb ) => {
  const width = $bg.width();
  const height = $bg.height();
  const bg = $bg.css('background-image');
  const bgImage = bg.substr(5, bg.length - 5 - 2);

  canvas.height = height;
  canvas.width = width;

  const img = new Image();
  img.onload = function () {
    const ratio = Math.min(this.width / width, this.height / height);
    const sWidth = width * ratio;
    const sHeight = height * ratio;
    const sx = (this.width - sWidth) / 2;
    const sy = (this.height - sHeight) / 2;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
    cb();
  };
  img.crossOrigin = "Anonymous";
  img.src = bgImage;
};

const drawPicture = ( canvas, $bg, $svg, cb ) => {
  const $parent = $svg.parent();
  const content = $parent[0].innerHTML.trim();
  const width = $svg.width();
  const height = $svg.height();
  const offset = $parent.parent().position();
  const paddingLeft = ($svg.width() - $svg.outerWidth()) / 2;
  const paddingTop = ($svg.height() - $svg.outerHeight()) / 2;

  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  canvg(buffer, content, {
    useCORS:        true,
    renderCallback: () => {
      const destCtx = canvas.getContext('2d');
      destCtx.drawImage(trim(buffer), offset.left - paddingLeft, offset.top - paddingTop);
      cb();
    }
  });
};

/**
 *
 * @param {jQuery} $bg
 * @param {jQuery} $svg
 * @param {function} cb
 * @return {*}
 */
export default ( $bg, $svg, cb ) => {
  const canvas = document.createElement('canvas');
  drawBg(canvas, $bg, () => {
    drawPicture(canvas, $bg, $svg, () => {
      cb(canvas.toDataURL());
    })
  });
}

function trim( c ) {
  const ctx = c.getContext('2d');
  const copy = document.createElement('canvas').getContext('2d');
  const pixels = ctx.getImageData(0, 0, c.width, c.height);
  const l = pixels.data.length;
  const bound = {
    top:    null,
    left:   null,
    right:  null,
    bottom: null
  };
  let i;
  let x;
  let y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  const trimHeight = bound.bottom - bound.top;
  const trimWidth = bound.right - bound.left;
  const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // open new window with trimmed image:
  return copy.canvas;
}