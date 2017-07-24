const $body = $('body');
const $items = $('.' + orientation_item);
const items = {
  square:     $('.' + orientation_square),
  vertical:   $('.' + orientation_vertical),
  horizontal: $('.' + orientation_horizontal),
};

export const types = ['square', 'vertical', 'horizontal'];

types.forEach(type => items[type].on('click', () => $body.trigger('orientation:select', type)));

$body.on('orientation:toggle', (e, availableTypes) => {
  $items.hide();
  availableTypes.forEach(type => items[type].show());
});

$body.on('orientation:set', ( e, type ) => {
  $items.removeClass(orientation_item_active);
  items[type].addClass(orientation_item_active);
});

