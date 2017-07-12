import randomString from '../../js/randomString';
import { setParam, getParam } from '../../js/history';

const $body = $('body');
const $svg = $('.' + mask_svg);

const $categoryItem = $(`<div class="${list_item}">`);
const $categoryWrapper = $('.' + picture_items).find('.' + list_wrapper);

const $sliderItem = $(`<div class="${slider_item}">`);
const $sliderWrapper = $('.' + picture_slider).find('.' + slider_content);

/** ============================================================================== */

let currentCategory = null;
let currentItem = null;
let currentModules = null;
let currentImage = null;

let items = null;

const categories = pictures.map(( item ) => {
  const $item = $categoryItem.clone();
  $item.html(item.title);
  return { item, $item };
});

categories.forEach(( category ) => {
  $categoryWrapper.append(category.$item);
  category.$item.on('click', () => selectCategory(category));
});

/** ============================================================================== */

setTimeout(() => {
  const picture = +getParam('picture');
  categories.forEach(( category ) => {
    if (!Array.isArray(category.item.items)) return;
    category.item.items.forEach(( item, i ) => {
      if (Array.isArray(item.items)) {
        item.items.forEach(( innerItem, j ) => {
          if (innerItem.id === picture) {
            selectCategory(category);
            selectModules(item.count);
            selectItem(items[j]);
          }
        })
      } else {
        if (item.id === picture) {
          selectCategory(category);
          selectItem(items[i]);
        }
      }
    })
  });
  if (!currentCategory || !currentItem) {
    selectCategory(categories[0]);
    selectItem(items[0]);
  }

  // selectCategory(categories[0]);
  // selectItem(items[0]);
});

$body.on('modules:plus', () => selectModules(currentModules + 1));
$body.on('modules:minus', () => selectModules(currentModules - 1));
$body.on('picture:remove', () => {
  currentImage = null;
  selectCategory(currentCategory);
  selectItem(currentItem);
});

/** ============================================================================== */

function selectCategory( category ) {
  if (currentCategory) currentCategory.$item.removeClass(list_active);
  category.$item.addClass(list_active);
  currentCategory = category;

  if (category.item.modules) {
    $body.trigger('modules:show');
    selectModules(category.item.items[0].count);
  } else {
    $body.trigger('modules:hide');
    items = buildSlider(category.item);
  }
}

function selectItem( item, silent = false ) {
  if (currentItem) currentItem.$item.removeClass(slider_active);
  item.$item.addClass(slider_active);
  currentItem = item;
  if (silent) return;
  const newImage = (currentImage && item.item.mask && currentCategory.item.upload)
    ? {
      ...item.item,
      full: currentImage
    }
    : item.item;
  $body.trigger('picture:change', [newImage]);
  setParam('picture', newImage.id);
}

function selectModules( count ) {
  const category = currentCategory.item.items.find(c => c.count === count);
  if (!category) return;
  currentModules = count;
  items = buildSlider(category);
  $body.trigger('modules:set', currentModules);
}

function buildSlider( category ) {
  $sliderWrapper.empty();

  const canUpload = currentCategory.item.upload;
  if (canUpload) {
    const $upload = $sliderItem.clone();
    const $uploadInput = $('<input type="file" />');
    $uploadInput.on('change', onFileUpload);
    $upload.addClass(slider_upload);
    $upload.append($uploadInput);
    $sliderWrapper.append($upload);
  }

  if (!Array.isArray(category.items)) return null;

  const slides = category.items.map(( item ) => {
    const src = canUpload ? currentImage || item.thumb : item.thumb;
    const $item = $sliderItem.clone();

    if (item.mask) {
      const $inner = $svg.clone();
      const img = new Image();
      const id = randomString();
      const $image = $inner.find('.' + mask_image);
      const $path = $inner.find('.' + mask_path);

      img.onload = function () {
        $image.attr('xlink:href', src);
        $image.attr('clip-path', `url(#${id})`);

        $.get(item.mask, ( content ) => {
          const $content = $(content);
          const viewBox = $content.find('svg').attr('viewBox');
          const mask = $content.find('polygon');

          $inner.attr('viewBox', viewBox);
          $path.attr('id', id);
          $path.html(mask);
        })
      };
      img.src = item.thumb;

      $item.html($inner);
    } else {
      $item.html(`<img src="${src}" />`);
    }
    return { item, $item };
  });

  slides.forEach(( item ) => {
    $sliderWrapper.append(item.$item);
    if (currentItem && item.item === currentItem.item) selectItem(item, true);
    item.$item.on('click', () => selectItem(item));
  });

  return slides;
}

function onFileUpload() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      currentImage = reader.result;
      selectCategory(currentCategory);
      selectItem(currentItem);
      $body.trigger('picture:upload');
    };
    reader.readAsDataURL(file);
  }
}