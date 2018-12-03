import * as THREE from "three";
import * as fbm from '../../shaders/fbm';

export default class ProceduralMap{
  constructor(manager, size = [512,512], frequency = 50, range = [0,1], octaves = 5){
      this.size = size;
      this.frequency = frequency;
      this.range = range;
      this.octaves = octaves;
      this.texture = new THREE.Texture();

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

    this.target = new THREE.WebGLRenderTarget(this.width,this.height);
    this.scene = new THREE.Scene();

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
      uniforms: this.feedbackUniforms,
      vertexShader: fbm.vert,
      fragmentShader: fbm.frag,
      transparent: true
    });

    const quad = new THREE.Mesh( geometry, material );
    this.scene.add( quad );

    this.camera.update();

    this.renderer.render(this.scene, this.camera, this.target);
  }

  invert(){}

  sample(st){}
}
