uniform sampler2D freqTexture;
uniform vec2 resolution;
uniform float time;
uniform vec2 audioResolution;

varying vec2 uvo;

void main(void)
{
        vec2 uv=abs(2.0*(uvo-0.5));
        
        vec4 t1 = texture2D(freqTexture, vec2(uv[0],0.1) );
        vec4 t2 = texture2D(freqTexture, vec2(uv[1],0.1) );
        float fft = t1[0]*t2[0]*0.6;
        gl_FragColor = vec4( sin(fft*3.141*2.5), sin(fft*3.141*2.0),sin(fft*3.141*1.0),1.0);
}
