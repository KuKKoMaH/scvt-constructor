const $body = $('body');
const $wrapper = $('.' + modules_wrapper);
const $count = $('.' + modules_count);

$('.' + modules_plus).on('click', () => $body.trigger('modules:plus'));
$('.' + modules_minus).on('click', () => $body.trigger('modules:minus'));

$body.on('modules:set', (e, count) => $count.html(count));
$body.on('modules:show', (e, count) => $wrapper.slideDown('fast'));
$body.on('modules:hide', (e, count) => $wrapper.slideUp('fast'));