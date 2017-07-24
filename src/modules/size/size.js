import app from '../canvas/canvas';
// let currentSize = null;

// $('.' + size_minus).on('click', () => setSize(currentSize - 10));
// $('.' + size_plus).on('click', () => setSize(currentSize + 10));

const $size = $('.' + size_wrapper);
const $body = $('body');

$body.on('picture:resize', (e, size) => setSize(size));

function setSize( size ) {
  $size.html(`${size[0].toFixed(0)} x ${size[1].toFixed(0)} см`);
}

