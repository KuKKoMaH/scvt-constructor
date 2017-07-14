export default (url, cb ) => {
  const mask = new PIXI.Graphics();
  $.get(url, ( content ) => {
    const $content = $(content);
    const $svg = $content.find('svg');
    const $polygons = $content.find('polygon');

    const viewport = $svg.attr('viewBox').split(' ');
    mask.lineStyle(0);

    $polygons.each(( i, polygon ) => {
      const dots = polygon.getAttribute('points').split(/[ ,]/).filter(i => i);
      mask.beginFill(0x8bc5ff, 0.4);
      mask.moveTo(+dots[0], +dots[1]);
      for(let i = 2; i < dots.length; i += 2) {
        mask.lineTo(+dots[i], +dots[i+1]);
      }
      mask.endFill();
    });
    mask.pivot.x = viewport[2] / 2;
    mask.pivot.y = viewport[3] / 2;

    cb(mask);
  });
}
