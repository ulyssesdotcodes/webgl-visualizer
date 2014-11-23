uniform sampler2D freqTexture;
uniform vec2 resolution;
uniform float time;
uniform vec2 audioResolution;

varying vec2 vUv;
#define P 3.14159
#define E .001

#define T .03 // Thickness
#define W 2.  // Width
#define A .09 // Amplitude
#define V 1.  // Velocity
void main() {
  vec2 c = vUv;
  float freq = texture2D(freqTexture, vec2(c.x, 0.5)).r;
	vec4 s = vec4(freq, freq, freq, 1.0);
	c = vec2(0, A*s.y*sin((c.x*W+time*V)* 2.5)) + (c*2.-1.);
	float g = max(abs(s.y/(pow(c.y, 2.1*sin(s.x*P))))*T,
				  abs(.1/(c.y+E)));
	gl_FragColor = vec4(g*g*s.y*.6, g*s.w*.44, g*g*.7, 1);
}
