import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import ProceduralMap from "./ProceduralMap";
import SimplexNoise from "simplex-noise";
import * as elevation from "../../shaders/elevation";

export default class ProceduralTerrain{
  constructor(city, options){
    this.width = options.size[0];
    this.height = options.size[1];
    this.detail = options.detail;
    this.elevation = options.elevation;
    this.amplitude = options.amplitude;
  }

  setup(){
    this.geometry = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.width * this.detail,
      this.height * this.detail
    );

    this.displace(this.elevation);
    this.generateMesh();
  }

  generateMesh(){
    this.elev_uniforms = {
      range: { value: this.amplitude },
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

  displace(map){
    const displacement_buffer = map.getBufferArray();
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;

    for (let i = 0; i < count; i++) {
    	const u = uvs[i * 2];
    	const v = uvs[i * 2 + 1];
      const x = (u * map.width);
      const y = (v * map.height);
      const d_index = (y * map.height + x) * 4; // fuck yeah!
    	let r = displacement_buffer[d_index];

      // r = ASMATH.scale(r,0,1,-1,1);

    	positions[i * 3 + 2] = r * this.amplitude;
    }

    this.geometry.getAttribute('position').needsUpdate = true;
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
