import * as THREE from "three";
import * as fbm from '../../shaders/fbm';
import * as invert from '../../shaders/invert';
import _ from "lodash";

export default class ProceduralMap{
  constructor(city, options){
      this.manager = city.manager;
      this.size = options.size;

      this.fbm = {
        time: options.time,
        bSmooth: options.bSmooth,
        map: options.map,
        scale: options.scale,
        offset: options.offset,
        octaves: options.octaves,
      };

      this.texture = new THREE.Texture();

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

  setupDisplay(){
    this.displayGeometry = new THREE.PlaneBufferGeometry(1,1);
    const material = new THREE.MeshBasicMaterial({
      map: this.target.texture,
      transparent: true
    });
    this.outputQuad = new THREE.Mesh( this.displayGeometry, material );
    this.outputQuad.position.z = -0.001;
    this.manager.scene.add( this.outputQuad );
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
    this.manager.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
    return buffer[0];
  }

  getBufferArray(){
    const buffer = new Float32Array(this.width*this.height*4); // NOTE: can't use floats in Safari!
    this.manager.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
    return buffer;
  }
}