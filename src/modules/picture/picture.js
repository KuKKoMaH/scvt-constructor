// import randomString from '../../js/randomString';
import { setParam, getParam } from '../../js/history';
import renderItem from './renderItem';
import { types as existOrientationTypes } from '../orientation/orientation';

/**
 * @typedef {Array.<category>} categories
 */

/**
 * @typedef {object} category
 * @prop {orientations | Array.<modules>} items
 * @prop {bool} modules
 * @prop {string} title
 * @prop {bool} upload
 * @prop {jQuery} $el
 */

/**
 * @typedef {object} modules
 * @prop {number} count
 * @prop {orientations} items
 */

/**
 * @typedef {object} orientations
 * @prop {pictures} [horizontal]
 * @prop {pictures} [square]
 * @prop {pictures} [vertical]
 */

/**
 * @typedef {Array.<picture>} pictures
 */

/**
 * @typedef {object} picture
 * @prop {string} full
 * @prop {string} id
 * @prop {string} mask
 * @prop {string} thumb
 * @prop {jQuery} $el
 */

const $body = $('body');

const $categoryItem = $(`<div class="${list_item}">`);
const $categoryWrapper = $('.' + picture_items).find('.' + list_wrapper);

const $sliderItem = $(`<div class="${slider_item}">`);
const $sliderWrapper = $('.' + picture_slider).find('.' + slider_content);

/** ============================================================================== */

/**
 * @type {number}
 */
let currentCategory = null;
/**
 * @type {number}
 */
let currentModules = null;
/**
 * @type {string}
 */
let currentOrientation = null;
/**
 *
 * @type {number}
 */
let currentItem = null;
/**
 *
 * @type {string}
 */
let currentItemId = null;
/**
 *
 * @type {string}
 */
let currentImage = null;

/**
 * @type {categories}
 */
const categories = window.pictures.map(( item ) => {
  const $el = $categoryItem.clone();
  $el.html(item.title);
  if (item.upload) $el.addClass(list_upload);
  return { ...item, $el };
});

categories.forEach(( category, i ) => {
  $categoryWrapper.append(category.$el);
  category.$el.on('click', () => selectCategory(i));
});

/** ============================================================================== */

setTimeout(() => {
  const picture = getParam('picture');
  categories.forEach(( category, i ) => {
    if (category.modules) {
      category.items.forEach(( modules, j ) => {
        existOrientationTypes.forEach(( type ) => {
          if (!modules.items[type]) return;
          modules.items[type].forEach(( item, k ) => {
            if (item.id === picture) {
              selectCategory(i, true);
              selectModules(j, true);
              selectOrientation(type);
              selectItem(k);
            }
          })
        })
      })
    } else {
      existOrientationTypes.forEach(( type ) => {
        if (!category.items[type]) return;
        category.items[type].forEach(( item, k ) => {
          if (item.id === picture) {
            selectCategory(i, true);
            selectOrientation(type);
            selectItem(k);
          }
        })
      })
    }
  });

  if (!Number.isInteger(currentCategory) || !Number.isInteger(currentItem)) {
    selectCategory(0);
    selectItem(0);
  }
});

$body.on('modules:plus', () => {
  const category = getCurrentCategory();
  const nextModules = currentModules + 1;
  if (category.items[nextModules]) selectModules(nextModules);
});
$body.on('modules:minus', () => {
  const nextModules = currentModules - 1;
  if (nextModules >= 0) selectModules(nextModules);
});
$body.on('orientation:select', ( e, type ) => selectOrientation(type));
$body.on('picture:remove', () => {
  currentImage = null;
  selectCategory(currentCategory);
  selectItem(currentItem);
});

/** ============================================================================== */

/**
 *
 * @param {number} i
 * @param {boolean} [silent]
 */
function selectCategory( i, silent ) {
  if (Number.isInteger(currentCategory)) categories[currentCategory].$el.removeClass(list_active);
  const category = categories[i];
  category.$el.addClass(list_active);
  currentCategory = i;

  if (category.modules) {
    $body.trigger('modules:show');
    if (!silent) selectModules(0);
  } else {
    $body.trigger('modules:hide');
    buildOrientation(silent);
  }
}

/**
 *
 * @param {number} i
 * @param {boolean} [silent]
 */
function selectModules( i, silent ) {
  const modules = categories[currentCategory].items[i];
  currentModules = i;
  $body.trigger('modules:set', modules.count);
  buildOrientation(silent);
  if (silent) return;
}

/**
 *
 * @param {string} orientation
 */
function selectOrientation( orientation ) {
  currentOrientation = orientation;
  $body.trigger('orientation:set', orientation);
  buildSlider();
}

/**
 * @param {number} i
 * @param {boolean} silent
 */
function selectItem( i, silent = false ) {
  const category = getCurrentCategory();
  const items = getCurrentItems();
  const item = items[i];

  if (Number.isInteger(currentItem) && items[currentItem] && items[currentItem].$el) {
    items[currentItem].$el.removeClass(slider_active);
  }
  currentItem = i;
  currentItemId = item.id;

  item.$el.addClass(slider_active);
  if (silent) return;

  const newImage = (currentImage && item.mask && category.upload)
    ? {
      ...item,
      full: currentImage
    }
    : item;
  $body.trigger('picture:change', [newImage]);
  setParam('picture', newImage.id);
}

/** ============================================================================== */

function getCurrentCategory() {
  return categories[currentCategory];
}

function getCurrentModules() {
  const category = getCurrentCategory();
  return category.items[currentModules];
}

/**
 *
 * @return {orientations}
 */
function getCurrentOrientations() {
  const category = getCurrentCategory();
  return (category.modules ? getCurrentModules() : category).items;
}

/**
 *
 * @return {pictures}
 */
function getCurrentItems() {
  const orientations = getCurrentOrientations();
  return orientations[currentOrientation];
}

/** ============================================================================== */

/**
 *
 * @param {boolean} [silent]
 */
function buildOrientation( silent ) {
  const orientations = getCurrentOrientations();
  const availableOrientations = Object.keys(orientations);
  $body.trigger('orientation:toggle', [availableOrientations]);
  if (silent) return;
  const firstOrientation = existOrientationTypes.find(type => orientations[type]);
  selectOrientation(firstOrientation);
}

function buildSlider() {
  const category = categories[currentCategory];
  const orientations = getCurrentOrientations();
  const items = getCurrentItems();
  $sliderWrapper.empty();

  const canUpload = category.upload;
  if (canUpload) {
    const $upload = $sliderItem.clone();
    const $uploadInput = $('<input type="file" />');
    $uploadInput.on('change', onFileUpload);
    $upload.addClass(slider_upload);
    $upload.append($uploadInput);
    $sliderWrapper.append($upload);
  }

  const slides = items.map(( item ) => {
    const src = canUpload ? currentImage || item.thumb : item.thumb;
    const $el = $sliderItem.clone();

    renderItem(src, item.mask, 126, 94).then(( dataURL ) => {
      const image = new Image();
      image.src = dataURL;
      $el.html(image);
    });

    return { ...item, $el };
  });

  orientations[currentOrientation] = slides;

  slides.forEach(( item, i ) => {
    $sliderWrapper.append(item.$el);
    if (item.id === currentItemId) selectItem(i, true);
    item.$el.on('click', () => selectItem(i));
  });

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