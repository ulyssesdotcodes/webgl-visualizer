uniform sampler2D freqTexture;
uniform vec2 resolution;
uniform float time;
uniform vec2 audioResolution;

varying vec2 vUv;

void main() {
	float fft = texture2D(freqTexture, vec2(vUv.x, 0.25)).a;
  float visibility = ceil(fft - vUv.y);
  vec4 freq = vec4(1,1,1,visibility);
	gl_FragColor = freq;
}
