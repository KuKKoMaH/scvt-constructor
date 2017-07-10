import getApp from './modules/app';

$('.' + form_button).on('click', () => {
  const app = getApp();
  const data = app.renderer.view.toDataURL();
  const img = new Image();
  img.src = data;
  $('body').append(img);
});