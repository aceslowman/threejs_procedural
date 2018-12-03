import * as THREE from "three";
import ProceduralMap from "./ProceduralMap";
import SimplexNoise from "simplex-noise";
import * as elevation from "../../shaders/elevation";

export default class ProceduralTerrain{
  constructor(city, width = 1.0, height = 1.0, detail = 200.0, amp = 0.2){
    this.width = width;
    this.height = height;
    this.detail = detail;

    this.noise_amp = amp
    this.noise_freq = 200;
    this.noise_octaves = 8;

    this.simplex = new SimplexNoise();
  }

  setup(){
    this.geometry = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.width * this.detail,
      this.height * this.detail
    );

    this.displace();
    this.generateMesh();
  }

  generateMesh(){
    this.elev_uniforms = {
      range: { value: this.noise_amp },
      draw_elev: {value: true},
      draw_topo: {value: true}
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: elevation.vert,
      fragmentShader: elevation.frag,
      uniforms: this.elev_uniforms,
      wireframe: true
    });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
  }

  displace(){
    let pos = this.geometry.getAttribute("position");
    let positions = pos.array;

    let i = 0;
    for(let x = 0; x < (this.width * this.detail)+1; x++){
      for(let y = 0; y < (this.height * this.detail)+1; y++){
        let _x = x;
        let _y = y;

        let val = 0.0;
        let amp = this.noise_amp;
        let freq = this.noise_freq;
        let oct = this.noise_octaves;

        for(let j = 0; j < oct; j++){
            val += amp * this.simplex.noise2D(_x / freq, _y / freq);
            _x *= 2.0;
            _y *= 2.0;
            amp *= 0.5;
        }

        positions[3*(y*((this.width * this.detail)+1)+x)+2] = val;
        i++;
      }
    }

    pos.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  globalBoundsCheck(a){
    let h_w = (this.width/2);
    let h_h = (this.height/2);

    if(a.x >= h_w || a.x <= -h_w || a.y >= h_h || a.y <= -h_h){
      console.warn('endpoint was out of bounds', a);
      return false;
    }

    return true;
  }
}
