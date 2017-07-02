import interact from 'interactjs';
import randomString from '../../js/randomString';

const $wrapper = $('.' + canvas_wrapper);
const $picture = $('.' + canvas_picture);
const $plainWrapper = $('.' + canvas_plain_wrapper);
const $plain = $('.' + canvas_plain);
const $svg = $('.' + mask_svg).clone();
const $image = $svg.find('.' + mask_image);
const $path = $svg.find('.' + mask_path);

const MINIMAL_SIZE = 200;
const MAXIMAL_SIZE = 600;

$picture.append($svg);

$('body')
  .on('background:change', ( e, item ) => {
    if (item) $wrapper.css('background-image', `url(${item.item.full})`)
  })
  .on('picture:change', ( e, item ) => {
    if (!item) return null;

    const img = new Image();
    img.onload = function () {
      if (item.mask) {
        $svg.show();
        $plainWrapper.hide();

        const id = randomString();

        $.get(item.mask, ( content ) => {
          const $content = $(content);
          const $mask = $content.find('polygon');
          const padding = $svg.innerWidth() - $svg.width();
          const viewBox = $content.find('svg').attr('viewBox');
          const sizes = viewBox.split(' ');
          const maskWidth = +sizes[2];
          const maskHeight = +sizes[3];
          const maskAvgSize = (maskWidth + maskHeight) / 2;
          const pictureWidth = $picture.innerWidth();
          const pictureHeight = $picture.innerHeight();
          const pictureAvgSize = (pictureWidth + pictureHeight) / 2 - padding;
          const ratio = pictureAvgSize / maskAvgSize;
          let width = maskWidth * ratio + padding;
          let height = maskHeight * ratio + padding;

          if (width < MINIMAL_SIZE) {
            height = height * (MINIMAL_SIZE / width);
            width = MINIMAL_SIZE;
          }
          if (width > MAXIMAL_SIZE) {
            height = height * (MAXIMAL_SIZE / width);
            width = MAXIMAL_SIZE;
          }
          if (height < MINIMAL_SIZE) {
            width = width * (MINIMAL_SIZE / height);
            height = MINIMAL_SIZE;
          }
          if (height > MAXIMAL_SIZE) {
            width = width * (MAXIMAL_SIZE / height);
            height = MAXIMAL_SIZE;
          }

          $picture.width(width);
          $picture.height(height);

          $svg.attr('viewBox', viewBox);
          $path.attr('id', id);
          $path.html($mask);
          $image.attr('xlink:href', item.full);
          $image.attr('clip-path', `url(#${id})`);

          const currentCenterX = (+$picture.attr('data-x') + pictureWidth / 2) || 0;
          const currentCenterY = (+$picture.attr('data-y') + pictureHeight / 2) || 0;
          const offsetX = currentCenterX - (width / 2);
          const offsetY = currentCenterY - (height / 2);
          $picture.css('transform', `translate(${offsetX}px, ${offsetY}px)`);
          $picture.attr('data-x', offsetX);
          $picture.attr('data-y', offsetY);

          $picture.fadeIn('fast');
        })
      } else {
        $svg.hide();
        $plainWrapper.show();
        $picture.width('auto');
        $picture.height('auto');
        $plain.attr('src', item.full);
        $picture.fadeIn('fast');
      }
    };
    $picture.fadeOut('fast', () => (img.src = item.full));
  });

import canvg from 'canvg-browser';
$('.' + canvas_wrapper + ' button').on('click', () => {
  const svg = document.querySelector("svg");
  const canvas = document.getElementById('canvas');
  const html = svg.parentNode.innerHTML.trim();
  canvas.height = svg.getAttribute('height');
  canvas.width = svg.getAttribute('width');
  console.log(html, canvas);
  canvg(canvas, html)
});

interact('.' + canvas_picture)
  .draggable({
    // inertia:    true,
    restrict:   {
      restriction: "parent",
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    autoScroll: true,
    onmove:     dragMoveListener,
  })
  .resizable({
    preserveAspectRatio: true,
    edges:               { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function ( event ) {
    const width = event.rect.width;
    const height = event.rect.height;

    if (width < MINIMAL_SIZE || height < MINIMAL_SIZE || width > MAXIMAL_SIZE || height > MAXIMAL_SIZE) return;

    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

    $picture.width(width);
    $picture.height(height);

    $picture.css('transform', 'translate(' + x + 'px,' + y + 'px)');
    $picture.attr('data-x', x);
    $picture.attr('data-y', y);
  });

function dragMoveListener( event ) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}
