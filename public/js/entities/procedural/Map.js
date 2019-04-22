import * as THREE from "three";
import * as fbm from './shaders/fbm';
import * as invert from './shaders/invert';
import * as ASMATH from "../../utilities/Math";
import _ from "lodash";

export default class ProceduralMap{
  constructor(manager, options){
      this.manager = manager;
      this.size = options.size;

      this.fbm = {
        time: options.time,
        bSmooth: options.bSmooth,
        map: options.map,
        scale: options.scale,
        offset: options.offset,
        octaves: options.octaves,
      };

      this.width = this.size[0];
      this.height = this.size[1];

      this.generate();
  }

  generate(){
    this.camera = new THREE.OrthographicCamera(
        this.width / - 2,
        this.width / 2,
        this.height / 2,
        this.height / -2,
        1,
        1000
    );

    this.camera.position.z = 1;

    this.uniforms = {
      time: { value: this.fbm.time },
      bSmooth: { value: this.fbm.bSmooth },
      map: { value: this.fbm.map },
      scale: { value: this.fbm.scale },
      offset: { value: this.fbm.offset },
      octaves: { value: this.fbm.octaves }
    };

    const geometry = new THREE.PlaneBufferGeometry( 2., 2.);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: fbm.vert,
      fragmentShader: fbm.frag
    });

    this.quad = new THREE.Mesh( geometry, material );

    this.scene = new THREE.Scene();
    this.scene.add( this.quad );

    this.target = new THREE.WebGLRenderTarget(this.width,this.height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    this.manager.renderer.render(this.scene, this.camera, this.target);
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

    this.manager.overScene.add( this.outputQuad );

    //setup label
    let labelPos = ASMATH.world2Screen(this.outputQuad.position, this.manager.ortho, this.manager.renderer.context.canvas);
    let cont = document.createElement("div");
    let label = document.createElement("h3");
    label.appendChild(document.createTextNode(name));

    label.style.margin = "5px";
    label.style.color = "white";

    cont.style.position = "absolute";
    cont.style.zIndex = 100;
    cont.style.width = this.width  + "px";
    cont.style.height = this.height  + "px";

    cont.style.left = (labelPos.x - (this.width/2.0)) + "px";
    cont.style.top = (labelPos.y - (this.height/2.0)) + "px";

    cont.appendChild(label);
    document.body.appendChild(cont);
  }

  /**
  * copies the current ProceduralMap, but inverted.
  * utilizes lodash cloneDeep
  * @returns {ProceduralMap} returns new ProceduralMap
  */
  invert(){

  }

  getSample(x, y){
    const buffer = new Float32Array(4); // NOTE: can't use floats in Safari!
    if(x > this.width || y > this.height || x < 0 || y < 0) console.warn("sampling out of bounds")
    this.manager.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
    return buffer[0];
  }

  getBufferArray(){
    const buffer = new Float32Array(this.width*this.height*4); // NOTE: can't use floats in Safari!
    this.manager.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
    return buffer;
  }
}
