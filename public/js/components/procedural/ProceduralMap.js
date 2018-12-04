import * as THREE from "three";
import * as fbm from '../../shaders/fbm';

export default class ProceduralMap{
  constructor(city, options){
      this.manager = city.manager;
      this.size = size;
      this.frequency = frequency;
      this.range = range;
      this.octaves = octaves;
      this.texture = new THREE.Texture();

      this.width = size[0];
      this.height = size[1];

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

    this.target = new THREE.WebGLRenderTarget(this.width,this.height); // make float

    this.manager.renderer.render(this.scene, this.camera, this.target);

    this.setupDisplay();
    // this.sample(10,10);
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

  sample(x, y){
    this.buffer = new Uint8Array(4); // make float
    this.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, this.buffer);
    console.log(this.buffer);
  }
}
