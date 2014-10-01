uniform sampler2D freqTexture;
varying vec2 vUv;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vec4 position_prime = projectionMatrix * vec4(position, 1.0);

	vUv = uv;
}