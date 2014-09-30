uniform sampler2D freqTexture;
uniform vec2 resolution;

varying vec2 vTextureCoord;

void main() {
	vec4 freq = texture2D(freqTexture, vTextureCoord.xy).rgba;
	gl_FragColor = freq;
}