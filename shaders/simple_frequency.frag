uniform sampler2D freqTexture;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
	vec4 freq = texture2D(freqTexture, vUv).rgba;
	gl_FragColor = freq;
}