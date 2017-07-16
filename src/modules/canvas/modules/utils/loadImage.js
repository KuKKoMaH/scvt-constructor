import 'pixi.js';
import Promise from 'bluebird';

export default ( url ) => {
  const texture = PIXI.Texture.fromImage(url);
  return new Promise(( res ) => {
    if (texture.width !== 1) return res(texture);
    texture.on('update', () => res(texture))
  });
}