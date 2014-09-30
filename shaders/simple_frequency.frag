uniform sampler2D freqTexture;
uniform vec2 resolution;

varying vec2 vTextureCoord;

void main() {
	// vec2 p = vec2(mod(gl_FragCoord.x, 63.0), mod(gl_FragCoord, 63.0));

	vec3 freq = texture2D(freqTexture, vec2(1, 1)).rgb;
	gl_FragColor = vec4(freq, 1.0);
}