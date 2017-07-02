import baron from 'baron';

$('.' + slider_container).each(( i, el ) => {
  const $el = $(el);

  baron({
    root:         $el.find('.baron'),
    scroller:     $el.find('.baron__scroller'),
    bar:          $el.find('.baron__bar'),
    scrollingCls: $el.find('_scrolling'),
    draggingCls:  $el.find('_dragging')
  }).controls({
    // Element to be used as interactive track. Note: it could be different from 'track' param of baron.
    track:    $el.find('.baron__track'),
    forward:  $el.find('.baron__down'),
    backward: $el.find('.baron__up')
  });
});
