import getApp from '../canvas/modules/app';

const $popup = $('.' + form_popup);
const $files = $('.' + form_files);
const $input = $files.find('input');
const $text = $files.find('.' + form_span);
let currentImage = null;

function declOfNum( number, titles ) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

$input.on('change', function () {
  const word1 = declOfNum(this.files.length, ['Выбран', 'Выбрано', 'Выбрано']);
  const word2 = declOfNum(this.files.length, ['файл', 'файла', 'файлов']);
  $text.html(`${word1} ${this.files.length} ${word2}`)
});

$('.' + form_button).on('click', () => $popup.fadeIn('fast'));
$('.' + form_close).on('click', () => $popup.fadeOut('fast'));

$('body')
  .on('picture:change', ( e, item ) => {
    currentImage = item.full;
  });

$(() => setTimeout(() => {
  const wpcf7 = window.wpcf7;
  if (!wpcf7) return;
  const origSubmit = wpcf7.submit;
  wpcf7.submit = ( form ) => {
    const app = getApp();
    const data = app.renderer.view.toDataURL();
    $("#form-composition").val(data);

    if (currentImage.indexOf('data:') === 0) {
      $("#form-picture").val(currentImage);
    }
    origSubmit(form);
  }
}, 0));
