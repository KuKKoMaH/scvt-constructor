import loadImage from '../../../js/loadImage';
import transitionend from '../../../js/transitionend';

let bg = null;
const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
let isFirstBg = true;

const $bg1 = $('.' + canvas_bg1);
const $bg2 = $('.' + canvas_bg2);

const setBg = ($el, src) => $el.css('background-image', 'url(' + src + ')');

setBg($bg1, transparentPixel);
setBg($bg2, transparentPixel);

$('body').on('background:change', (e, item) => {
  if (!item) return;
  if (item.item === bg) return;

  loadImage(item.item.full, (image) => {
    const $nextBg = isFirstBg ? $bg2 : $bg1;
    const $currentBg = isFirstBg ? $bg1 : $bg2;
    setBg($nextBg, image.src);
    $nextBg.addClass(canvas_bg_active);

    if ($currentBg.hasClass(canvas_bg_active))
      $currentBg.one(transitionend, () => setBg($currentBg, transparentPixel));
    $currentBg.removeClass(canvas_bg_active);

    isFirstBg = !isFirstBg;
    bg = image;
  });
});
