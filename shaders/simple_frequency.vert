uniform sampler2D freqTexture;
varying vec2 vTextureCoord;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vTextureCoord - vec2(position.x, position.y);
}