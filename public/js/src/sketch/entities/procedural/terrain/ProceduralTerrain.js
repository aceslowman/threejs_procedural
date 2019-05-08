import * as THREE from 'three';
import * as elevation from '../shaders/elevation';

import Map from '../ProceduralMap';

export default class ProceduralTerrain {
  constructor(manager, options){
    this.manager   = manager;
    this.width     = options.width;
    this.height    = options.height;
    this.detail    = options.detail;
    this.elevation = options.elevation;
    this.amplitude = options.amplitude;

    this.verbose = false;
  }

  setup(){
    this.geometry = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.detail,
      this.detail
    );

    this.displace();
    this.generateNormals();
    this.generateMesh();
  }

  setupDebug(){
    var helper = new THREE.Box3Helper( this.geometry.boundingBox, 0xffff00 );
    this.manager.scene.add( helper );
  }

  /**
  * Displace the buffer geometry using a given Map
  */
  displace(){
    // TODO: can I just use the MeshStandardMaterial.displacementMap?

    const displacement_buffer = this.elevation.getBufferArray();
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;

    for (let i = 0; i < count; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (this.elevation.width-1.0));
      const y = Math.floor(v * (this.elevation.height-1.0));
      const d_index = (y * this.elevation.height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);

      if(!r){
        // TODO: implement some sort of check that prevents this.
        console.warn('cannot find value in displacement buffer');
      }
    }

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    this.geometry.translate(0,0,-this.geometry.boundingBox.min.z);
  }

  generateNormals(){

  }

  /*
  * Generates terrain mesh, and utilizes custom shaders.
  */
  generateMesh(){
    /*
      TODO: explore whether or not I should manually displace the
      geometry, or just utilize the MeshStandardMaterial to do so

    */
    // this.elev_uniforms = {
    //   range: { value: this.geometry.boundingBox.max.z },
    //   draw_elev: {value: true},
    //   draw_topo: {value: false}
    // };

    // this.material = new THREE.ShaderMaterial({
    //   vertexShader: elevation.vert,
    //   fragmentShader: elevation.frag,
    //   uniforms: this.elev_uniforms,
    //   wireframe: false,
    //   side: THREE.DoubleSide
    // });
    // this.material = new THREE.MeshStandardMaterial({
    //   map: this.elevation.target
    // });

    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.manager.scene.add(this.mesh);
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
      if(this.verbose)console.warn('endpoint was out of bounds', a);
      return false;
    }

    return true;
  }
}
