/**
 * Доки
 * https://vk.com/dev/widget_share
 * https://developers.facebook.com/docs/sharing/reference/share-dialog
 * https://dev.twitter.com/web/tweet-button
 * https://apiok.ru/ext/like
 */

let image = null;
$('body').on('background:change', ( e, item ) => {
  if (!item) return;
  image = item.item.full;
});

const getParams = () => ({
  url:   encodeURIComponent(window.location.href),
  title: encodeURIComponent(document.title),
  desc:  encodeURIComponent($('meta[name="description"]').attr('content')),
  image
});

const links = {
  vk: p => `http://vk.com/share.php?url=${p.url}&title=${p.title}&image=${p.image}&noparse=true`,
  fb: p => {
    let url = `https://www.facebook.com/dialog/share`;
    url += '?app_id=1814752601873349';
    url += '&display=popup';
    url += '&href=' + p.url;
    return url;
  },
  tw: p => `https://twitter.com/intent/tweet?text=${p.desc}&url=${p.url}&hashtags=&via=`,
  ok: p => `https://connect.ok.ru/offer?url=${p.url}&title=${p.title}&description=${p.desc}&imageUrl=${p.image}`
};

const generateLink = ( type ) => {
  const params = getParams();
  window.open(links[type](params), '', 'toolbar=0,status=0,width=626,height=436');
};

$('.' + footer_vk).on('click', () => generateLink('vk'));
$('.' + footer_fb).on('click', () => generateLink('fb'));
$('.' + footer_tw).on('click', () => generateLink('tw'));
$('.' + footer_ok).on('click', () => generateLink('ok'));
