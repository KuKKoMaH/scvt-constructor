const $popup = $('.' + help_popup);
const $body = $('body');

$('.' + help_button).on('click', () => {
  $popup.fadeIn('fast', () => {
    $body.one('click', () => $popup.fadeOut('fast'));
  });
});
