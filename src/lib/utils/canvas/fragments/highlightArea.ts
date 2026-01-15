export default `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec4 uRect;
  uniform vec2 uResolution;
  uniform float uDarkness;

  void main(void) {
    vec2 coord = vTextureCoord * uResolution;
    vec4 color = texture2D(uSampler, vTextureCoord);

    float insideX = step(uRect.x, coord.x) * step(coord.x, uRect.x + uRect.z);
    float insideY = step(uRect.y, coord.y) * step(coord.y, uRect.y + uRect.w);
    float inside = insideX * insideY;

    vec3 darkened = color.rgb * (1.0 - uDarkness);
    vec3 finalColor = mix(darkened, color.rgb, inside);

    gl_FragColor = vec4(finalColor, color.a);
  }
`;
