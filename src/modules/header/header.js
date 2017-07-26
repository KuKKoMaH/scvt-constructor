const $items = $('.' + header_menu + ' a');

$items.on('click', function () {
  const $el = $(this);
  const id = $el.data('id');

  $items.removeClass(header_active);
  $el.addClass(header_active);

  if (SECTION_ENDPOINT && id) {
    $.get(SECTION_ENDPOINT, { id }, ( data ) => {
      $('.' + page_text).html(data);
      $('.' + page_wrapper).addClass(page_wrapper_active);
    });
  } else {
    $('.' + page_wrapper).addClass(page_wrapper_active);
  }
});

$('.' + header_callback).on('click', () => {
  $('.' + callback_wrapper).addClass(callback_wrapper_active);
});
