import app from '../canvas/canvas';

const $popup = $('.' + form_wrapper);
const $files = $('.' + form_files);
const $input = $files.find('input');
const $text = $files.find('.' + form_span);
let currentImage = null;
let currentSize = null;

function declOfNum( number, titles ) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

$input.on('change', function () {
  const word1 = declOfNum(this.files.length, ['Выбран', 'Выбрано', 'Выбрано']);
  const word2 = declOfNum(this.files.length, ['файл', 'файла', 'файлов']);
  $text.html(`${word1} ${this.files.length} ${word2}`)
});

$('.' + form_button).on('click', () => {
  const data = app.app.renderer.view.toDataURL();
  $("#form-composition").val(data);
  if (currentImage.indexOf('data:') === 0) $("#form-picture").val(currentImage);
  $('#form-size').val(`${currentSize[0].toFixed(0)} x ${currentSize[1].toFixed(0)} см`);
  $('.' + form_preview).attr('src', currentImage);
  $popup.addClass(form_wrapper_active);
});
$('.' + form_close).on('click', () => $popup.removeClass(form_wrapper_active));

$('body')
  .on('picture:change', ( e, item ) => (currentImage = item.full))
  .on('picture:resize', ( e, size ) => (currentSize = size));

if (!isProduction) {
  $('.' + form_form).on('submit', ( e ) => {
    e.preventDefault();
    const data = app.takeScreenshot();
    const img = new Image();
    img.src = data;
    $('body').append(img);
  });
}

// $(() => setTimeout(() => {
//   const wpcf7 = window.wpcf7;
//   if (!wpcf7) return;
//   const origSubmit = wpcf7.submit;
//   wpcf7.submit = ( form ) => {
//     const data = app.app.renderer.view.toDataURL();
//     $("#form-composition").val(data);
//
//     if (currentImage.indexOf('data:') === 0) {
//       $("#form-picture").val(currentImage);
//     }
//     origSubmit(form);
//   }
// }, 0));
