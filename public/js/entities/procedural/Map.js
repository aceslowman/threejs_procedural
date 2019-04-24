import * as THREE from "three";
import * as ASMATH from "../../utilities/Math";
import _ from "lodash";

import { EffectComposer } from '../../utilities/EffectComposer/EffectComposer.js';

export default class ProceduralMap{
  constructor(manager, options){
    this.manager = manager;

    this.width  = options.width  || 256;
    this.height = options.height || 256;

    this.initialize();
  }

  initialize(){
    this.uniforms = {};

        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        });

    // TODO: use EffectComposer
    this.composer = new THREE.EffectComposer(this.manager.renderer, this.target);
    this.composer.setSize(this.width, this.height);

    this.shader = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;

        void main()	{
            vUv = uv;
            gl_Position = vec4( position, 1.0 );
        }
        `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }
      `
    });

    const shaderPass = new THREE.ShaderPass(this.shader, "shader");
    this.composer.addPass(shaderPass);

    //--------------------------------------------------------------------------

    this.quad = new THREE.Mesh(this.geometry, this.material);
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);

    this.camera = new THREE.OrthographicCamera(
      this.width / - 2,
      this.width / 2,
      this.height / 2,
      this.height / - 2,
      0,
      1
    );
  }

  render(){
    this.composer.render();
  }

  setupDisplay(name, position){
    //setup texture
    const geometry = new THREE.PlaneBufferGeometry(this.width,this.height);
    const material = new THREE.MeshBasicMaterial({
      map: this.target.texture
    });

    this.outputQuad = new THREE.Mesh( geometry, material );
    this.outputQuad.position.x = position.x;
    this.outputQuad.position.y = position.y;

    this.manager.scene.add( this.outputQuad );

    //setup label
    let labelPos = ASMATH.world2Screen(this.outputQuad.position, this.manager.ortho, this.manager.renderer.context.canvas);
    let cont = document.createElement("div");
    let label = document.createElement("h3");
    label.appendChild(document.createTextNode(name));

    label.style.margin = "5px";
    label.style.color = "white";

    cont.style.position = "absolute";
    cont.style.zIndex = 100;
    cont.style.width = this.width + "px";
    cont.style.height = this.height + "px";

    cont.style.left = (labelPos.x - (this.width/2.0)) + "px";
    cont.style.top = (labelPos.y - (this.height/2.0)) + "px";

    cont.appendChild(label);
    document.body.appendChild(cont);
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
