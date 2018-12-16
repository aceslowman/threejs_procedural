const vert = `
varying vec2 vUv;

void main()	{
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
}
`;

const frag = `
varying vec2 vUv;
uniform sampler2D tex0;

void main(){
    vec3 color = texture2D(tex0, vUv).rgb;
    color = vec3(1.0) - color;

    gl_FragColor = vec4(color,1.0);
}
`;

export { vert, frag }
