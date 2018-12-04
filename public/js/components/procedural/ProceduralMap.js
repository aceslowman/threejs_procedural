import * as THREE from "three";
import * as fbm from '../../shaders/fbm';

export default class ProceduralMap{
  constructor(city, options){
      this.manager = city.manager;
      this.size = options.size;
      this.frequency = options.frequency;
      this.range = options.range;
      this.octaves = options.octaves;
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
      time: { value: 0 },
      bSmooth: { value: true },
      map: { value: [0,1] },
      scale: { value: [1,1] },
      offset: { value: [0,0] },
      octaves: { value: 8}
    };

    const geometry = new THREE.PlaneBufferGeometry( 2., 2.);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: fbm.vert,
      fragmentShader: fbm.frag
    });

    const quad = new THREE.Mesh( geometry, material );

    this.scene = new THREE.Scene();
    this.scene.add( quad );

    this.target = new THREE.WebGLRenderTarget(this.width,this.height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    }); // make float

    this.manager.renderer.render(this.scene, this.camera, this.target);
  }

  setupDisplay(){
    this.displayGeometry = new THREE.PlaneBufferGeometry(1,1);
    const material = new THREE.MeshBasicMaterial({
      map: this.target.texture,
      transparent: true
    });
    this.outputQuad = new THREE.Mesh( this.displayGeometry, material );
    this.manager.scene.add( this.outputQuad );
  }

  invert(){}

  getSample(x, y){
    const buffer = new Float32Array(4); // can't use floats in Safari!
    this.manager.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
    return buffer;
  }

  getBufferArray(){
    const buffer = new Float32Array(this.width*this.height*4); // can't use floats in Safari!
    this.manager.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
    return buffer;
  }
}
