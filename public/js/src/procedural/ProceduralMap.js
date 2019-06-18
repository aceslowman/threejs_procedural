import * as THREE from "three";
import * as ASMATH from "../utilities/Math";
import _ from "lodash";

import { EffectComposer } from '../utilities/EffectComposer/EffectComposer.js';

export default class ProceduralMap{
  constructor(renderer, options){
    this.renderer = renderer;

    this.width  = options.width  || 256;
    this.height = options.height || 256;

    let temp_seed = Math.random() * 10000;

    this.passes = options.passes || [
      new FractalNoise(8, temp_seed),
      new FractalWarp(4, temp_seed)
    ];

    this.name = options.name || "default map";

    this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearMipMapLinearFilter,
			magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, // important for readPixels()
      type: THREE.FloatType, // important for readPixels()
			stencilBuffer: false
    });

    this.composer = new THREE.EffectComposer(this.renderer, this.target);
    this.composer.setSize(this.width, this.height);
  
    for (let pass of this.passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      this.composer.addPass(p);
    }

    this.composer.swapBuffers();
    this.render();
  }

  render(){
    this.composer.render();
  }
  //----------------------------------------------------------------------------

  getSample(x, y){
    const buffer = new Float32Array(4); // NOTE: can't use floats in Safari!
    if (x > this.width || y > this.height || x < 0 || y < 0) console.warn("sampling out of bounds")
    this.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
    return buffer[0];
  }

  getBufferArray(){
    const buffer = new Float32Array(this.width*this.height*4); // NOTE: can't use floats in Safari!
    this.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
    return buffer;
  }
}
