import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import _ from "lodash";

import { EffectComposer } from '../../utilities/EffectComposer/EffectComposer.js';

export default class ProceduralMap{
  constructor(manager, options){
    this.manager = manager;

    this.width  = options.width  || 256;
    this.height = options.height || 256;

    this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearMipMapLinearFilter,
			magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, // important for readPixels()
      type: THREE.FloatType, // important for readPixels()
			stencilBuffer: false
    });

    this.initializeComposer();
  }

  initializeComposer(){
    this.composer = new THREE.EffectComposer(this.manager.renderer, this.target);
    this.composer.setSize(this.width, this.height);
  }

  render(){
    this.composer.render();
  }
  //----------------------------------------------------------------------------

  getSample(x, y){
    const buffer = new Float32Array(4); // NOTE: can't use floats in Safari!
    if (x > this.width || y > this.height || x < 0 || y < 0) console.warn("sampling out of bounds")
    this.manager.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
    return buffer[0];
  }

  getBufferArray(){
    const buffer = new Float32Array(this.width*this.height*4); // NOTE: can't use floats in Safari!
    this.manager.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
    return buffer;
  }
}
