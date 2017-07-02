let currentSize = null;

$('.' + size_minus).on('click', () => setSize(currentSize - 10));
$('.' + size_plus).on('click', () => setSize(currentSize + 10));

const $size = $('.' + size_size);
const $body = $('body');

setSize(70);

function setSize( size ) {
  if(size > window.size.maxWidth) return;
  if(size < window.size.minWidth) return;
  currentSize = size;
  $size.html(currentSize + ' см');
  $body.trigger('size:change', currentSize);
}