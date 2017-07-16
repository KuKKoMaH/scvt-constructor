DropShadowFilter.sharedCopyFilter = new PIXI.Filter();

function DropShadowFilter(angle, distance, spread, color, alpha) {
  PIXI.Filter.call(this);

  angle *= Math.PI / 180;
  this.angle = angle;
  this.padding = distance;
  this.distance = distance;
  this.color = color;
  this.padding = distance < 10 ? 10 : distance;
  this.blur = spread;
  this.alpha = alpha;

  this.tintFilter = new PIXI.Filter(
    PIXI.Filter.defaultVertexSrc,
    ['varying vec2 vTextureCoord;',
      'uniform sampler2D uSampler;',
      'uniform float alpha;',
      'uniform vec3 color;',
      'void main(void){',
      '   vec4 sample = texture2D(uSampler, vTextureCoord);',
      '   gl_FragColor = vec4(color, sample.a > 0.0 ? alpha : 0.0);',
      '}'].join("\n")
  );
  this.tintFilter.uniforms.alpha = alpha;
  this.tintFilter.uniforms.color = PIXI.utils.hex2rgb(color);

  this.blurFilter = new PIXI.filters.BlurFilter();
  this.blurFilter.blur = spread;
}
DropShadowFilter.prototype = Object.create(PIXI.Filter.prototype);
DropShadowFilter.prototype.constructor = DropShadowFilter;
DropShadowFilter.prototype.apply = function (filterManager, input, output) {
  var rt = filterManager.getRenderTarget();
  rt.clear();
  if (!output.root) output.clear();
  rt.transform = new PIXI.Matrix();
  rt.transform.translate(this.distance * Math.cos(this.angle), this.distance * Math.sin(this.angle));
  this.tintFilter.apply(filterManager, input, rt);
  this.blurFilter.apply(filterManager, rt, output);
  DropShadowFilter.sharedCopyFilter.apply(filterManager, input, output);
  rt.transform = null;
  filterManager.returnRenderTarget(rt);
};
PIXI.filters.DropShadowFilter = DropShadowFilter;
