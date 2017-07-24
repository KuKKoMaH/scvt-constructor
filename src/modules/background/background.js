import { setParam, getParam } from '../../js/history';
let currentCategory = null;
let currentItem = null;

const $categoryItem = $(`<div class="${list_item}">`);
const $categoryWrapper = $('.' + background_items).find('.' + list_wrapper);

const $sliderItem = $(`<div class="${slider_item}">`);
const $sliderWrapper = $('.' + background_slider).find('.' + slider_content);

const categories = bg.map(( item ) => {
  const $item = $categoryItem.clone();
  $item.html(item.title);
  return { item, $item };
});

let items = null;

categories.forEach(( category ) => {
  $categoryWrapper.append(category.$item);
  category.$item.on('click', () => selectCategory(category));
});

setTimeout(() => {
  const bg = getParam('background');
  categories.forEach(( category ) => {
    if (!Array.isArray(category.item.items)) return;
    category.item.items.forEach(( item, i ) => {
      if (item.id === bg) {
        selectCategory(category);
        selectItem(items[i]);
      }
    })
  });
  if (!currentCategory || !currentItem) {
    selectCategory(categories[0]);
    selectItem(items[0]);
  }
});

function selectCategory( category ) {
  if (currentCategory) currentCategory.$item.removeClass(list_active);
  category.$item.addClass(list_active);
  currentCategory = category;

  items = null;
  $sliderWrapper.empty();
  if (Array.isArray(category.item.items)) {
    items = category.item.items.map(( item ) => {
      const $item = $sliderItem.clone();
      $item.html(`<img src="${item.thumb}" />`);
      return { item, $item };
    });

    items.forEach(( item ) => {
      $sliderWrapper.append(item.$item);
      if (currentItem && item.item === currentItem.item) selectItem(item);
      item.$item.on('click', () => selectItem(item));
    });
  }
}

function selectItem( item ) {
  console.log(item);
  if (currentItem) currentItem.$item.removeClass(slider_active);
  item.$item.addClass(slider_active);
  currentItem = item;
  $('body').trigger('background:change', item);
  setParam('background', item.item.id);
}
