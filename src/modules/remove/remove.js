const $body = $('body');
const $button = $('.' + remove_button);

$button.on('click', () => {
  if(confirm('Вы деййствительно хотите удалить загруженное изображение?')){
    $body.trigger('picture:remove');
    $button.fadeOut('fast');
  }
});

$body.on('picture:upload', () => $button.fadeIn('fast'));