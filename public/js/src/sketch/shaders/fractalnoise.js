import * as THREE from 'three';

export default class FractalNoise {
  constructor(octaves){
    this.shaderMaterial = new THREE.ShaderMaterial({
      defines: {
        'NUM_OCTAVES': octaves
      },
      uniforms: {
        o_x: { value: 0.00 },
        o_y: { value: 0.00 },
        o_z: { value: 0.00 },
        s_x: { value: 1.00 },
        s_y: { value: 1.00 },
        s_z: { value: 1.00 },
        map_min: { value: -1.00 },
        map_max: { value: 1.00 },
      },
      name: "FractalNoise"
    });

    this.compile();
  }

  /*
    call compile() if the shader constants needs to be reset.
  */
  compile(){
    const noise = `
      //	Simplex 3D Noise
      //	by Ian McEwan, Ashima Arts
      //
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //  x0 = x0 - 0. + 0.0 * C
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      // Permutations
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients
      // ( N*N points uniformly over a square, mapped onto an octahedron.)
      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }`;

    //------------------------------------------------------------------------------

    this.vert = `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main()	{
          vUv = uv;
          vPosition = position;
          gl_Position = vec4( position, 1.0 );
      }
      `;

    this.frag = noise + `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float o_x;
      uniform float o_y;
      uniform float o_z;

      uniform float s_x;
      uniform float s_y;
      uniform float s_z;

      uniform float map_min;
      uniform float map_max;

      float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }

      float fbm(vec3 x) {
      	float v = 0.0;
      	float a = 0.5;
      	vec3 shift = vec3(100);
      	for (int i = 0; i < NUM_OCTAVES; ++i) {
      		v += a * snoise(x);
      		x = x * 2.0 + shift;
      		a *= 0.5;
      	}
      	return v;
      }

      void main() {
        vec3 offset = vec3(o_x,o_y,o_z);
        vec3 scale = vec3(s_x,s_y,s_z);

        vec3 p = (vPosition * scale) + offset;

        // float n = fbm(p + fbm(p + fbm(p)));
        float n = fbm(p);

        float c = map(n, -1.0, 1.0, map_min, map_max);
        gl_FragColor = vec4(c, c, c, 1.0);
      }
    `;

    this.shaderMaterial.vertexShader   = this.vert;
    this.shaderMaterial.fragmentShader = this.frag;
  }
};