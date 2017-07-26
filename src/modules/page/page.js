$('.' + page_close).on('click', () => {
  $('.' + page_wrapper).removeClass(page_wrapper_active);
  $('.' + header_active).removeClass(header_active);
});
