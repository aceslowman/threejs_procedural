const vert = `
varying float elev;

void main()	{
    elev = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const frag = `
uniform sampler2D tex0;
uniform float range;
uniform bool draw_elev;
uniform bool draw_topo;

varying float elev;

float map(float value, float min1, float max1, float min2, float max2){
    float perc = (value - min1) / (max1 - min1);

    return perc * (max2 - min2) + min2;
}

void main(){
    vec4 color = vec4(0,0,0,0);
    float alpha = 0.0;
    float n_elev = map(elev, -range, range, 0.0, 1.0);

    float s_offset = 0.1;
    float s_w = 0.04; // multiply by 'steepness'
    float s_pos = mod(n_elev,s_offset) * (n_elev/s_offset);

    float stroke = step(n_elev, s_pos + s_w) - step(n_elev, s_pos - s_w);

    if(draw_elev){
      color += vec4(vec3(n_elev),1.0);
    }

    if(draw_topo){
      (stroke > 0.0) ? alpha = 1.0 : alpha = 0.0;
      color += vec4(vec3(stroke),alpha);
    }

    gl_FragColor = color;
}
`;

export { vert, frag }
