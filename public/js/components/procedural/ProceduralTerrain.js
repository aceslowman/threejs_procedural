import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import ProceduralMap from "./ProceduralMap";
import SimplexNoise from "simplex-noise";
import * as elevation from "../../shaders/elevation";

export default class ProceduralTerrain{
  constructor(city, options){
    this.city = city;
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

    this.city.scene.add(this.mesh);
  }

  setupDebug(){
    var helper = new THREE.Box3Helper( this.geometry.boundingBox, 0xffff00 );
    this.city.scene.add( helper );
  }

  /**
  * Displace the buffer geometry using a given ProceduralMap
  * @param {ProceduralMap} map - a map representing a grayscale elevation map.
  */
  displace(map){
    const displacement_buffer = map.getBufferArray();
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;

    for (let i = 0; i < count; i++) {
    	const u = uvs[i * 2];
    	const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (map.width-1.0));
      const y = Math.floor(v * (map.height-1.0));
      const d_index = (y * map.height + x) * 4;
    	let r = displacement_buffer[d_index];

    	positions[i * 3 + 2] = (r * this.amplitude);

      if(!r){
        console.error("cannot find value in displacement buffer");
      }
    }

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    this.geometry.translate(0,0,-this.geometry.boundingBox.min.z);
  }

  /**
  * Generates terrain mesh, and utilizes custom shaders.
  */
  generateMesh(){
    this.elev_uniforms = {
      range: { value: this.geometry.boundingBox.max.z },
      draw_elev: {value: true},
      draw_topo: {value: true}
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: elevation.vert,
      fragmentShader: elevation.frag,
      uniforms: this.elev_uniforms,
      wireframe: false,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
  }

  /**
  * Checks to see if a given point is within bounds of the terrain.
  * @param {Vector2} a - the point to be checked
  * @returns {Boolean} true if within bounds, false if not
  */
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
