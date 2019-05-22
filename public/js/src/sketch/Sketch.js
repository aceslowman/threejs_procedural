import * as THREE from 'three';
import React from 'react';
import Toolbar from '../gui/GUI'
import Stats from "stats-js";

import OrbitControls from "./utilities/OrbitControls.js";

// PROCEDURAL TOOLS IMPORTS
import ProceduralMap from './procedural/ProceduralMap';
import ProceduralTerrain from './procedural/terrain/ProceduralTerrain';

// SHADER IMPORTS
import FractalNoise from "./shaders/fractalnoise.js";
import FractalWarp from "./shaders/fractalwarp.js";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);

    // SETUP LISTENERS
    window.addEventListener('resize', this.handleResize);

    this.state = {
      random_seed: Math.random() * 10000,
      maps: {
        elevation: ''
      }
    }
  }

  getPassById(id){ // UTIL
    for(let m in this.state.maps){
      for(let p in this.state.maps[m].composer.passes){
        let pass = this.state.maps[m].composer.passes[p];

        if(pass.material.name == id){
          return pass;
        }
      }
    }
  }

  setupCameras(){
    this.first_person_cam = new THREE.PerspectiveCamera(
      75,            // fov
      this.width / this.height,   // aspect
      0.01,          // near
      2000           // far
    );
    this.first_person_cam.name = "First Person";

    this.ortho_cam = new THREE.OrthographicCamera();
    this.ortho_cam.name = "Orthographic";

    this.perspective_cam = new THREE.PerspectiveCamera(
      75,            // fov
      this.width / this.height,   // aspect
      0.01,          // near
      2000           // far
    );
    this.perspective_cam.name = "Perspective";
    this.perspective_cam.zoom = 2;
    this.perspective_cam.position.z = 999;
    this.perspective_cam.updateProjectionMatrix();

    // set default camera
    this.camera = this.perspective_cam;

    this.setupOrbit();

    // send to store
    this.props.addCamera(this.first_person_cam);
    this.props.addCamera(this.ortho_cam);
    this.props.addCamera(this.perspective_cam);
  }

  setupOrbit() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.8;
    // this.orbitControls.panningMode = THREE.HorizontalPanning; // default is THREE.ScreenSpacePanning
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 1000;
    // this.orbitControls.maxPolarAngle = Math.PI / 2;
    // this.orbitControls.autoRotate = true;
  }
  
  setupShaderPasses(map, passes) {
    for (let pass of passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      map.composer.addPass(p);
    }

    map.composer.swapBuffers();
  }

  setupStats() {
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '0px';
    this.stats.domElement.style.left = '';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.style.top = '';
    this.stats.domElement.style.display = 'visible';
    document.getElementById('APP').appendChild(this.stats.domElement);
  }

  componentDidUpdate(prevProps) {
    if (this.props.passes != prevProps.passes) {
      for (let p in this.props.passes) {
        let prop_pass = this.props.passes[p];
        let prevPass = prevProps.passes[p];

        if (prop_pass != prevPass && prevPass) {
          let pass = this.getPassById(prop_pass.id);

          let params_changed = prop_pass.params != prevPass.params;
          let defines_changed = prop_pass.defines != prevPass.defines;
          let uniforms_changed = prop_pass.uniforms != prevPass.uniforms;

          if (params_changed) {
            pass.enabled = prop_pass.params.enabled;
            pass.renderToScreen = prop_pass.params.renderToScreen;
          }

          if (defines_changed) {
            Object.assign(pass.material.defines, prop_pass.defines);
            pass.material.needsUpdate = true;
          }

          if (uniforms_changed) {
            Object.assign(pass.material.uniforms, prop_pass.uniforms);
          }
        }
      }

      this.state.maps.elevation.render(); //TODO: update only the map that changed.
      this.terrain.displace(); //TODO: displace only if necessary
    }

    /* TODO: this seems like it can be streamlined and simplified.
             how do I map a serialized object to it's unserialized relative?
    */
    if (this.props.cameras != prevProps.cameras){
      if (this.props.cameras["Perspective"] != prevProps.cameras["Perspective"] && prevProps.cameras["Perspective"]){

        for(let key in this.props.cameras["Perspective"]){
          if (this.props.cameras["Perspective"][key] != prevProps.cameras["Perspective"][key]){
            console.log(`${key} has changed to ${this.props.cameras["Perspective"][key]}`);
            this.perspective_cam[key] = this.props.cameras["Perspective"][key];
          }
        }

        this.perspective_cam.updateProjectionMatrix();
      }
    }
  }

  componentDidMount() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight

    this.entities = [];

    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);
    this.start();

    this.scene = new THREE.Scene({
      background: 'green'
    });

    this.setupCameras();

    let map = new ProceduralMap(this.renderer, {width: 512, height: 512});

    this.setupShaderPasses(map, [
      new FractalNoise(8, this.state.random_seed),
      new FractalWarp(4, this.state.random_seed)
    ]);

    map.render();

    // SETUP TERRAIN
    this.terrain = new ProceduralTerrain(this.renderer, this.scene, {
      width: 512,
      height: 512,
      detail: 512.0,
      amplitude: 300,
      elevation: map
    });

    this.terrain.setup();
    this.terrain.setupDebug();

    this.setupStats();

    this.setState({
      maps: {
        elevation: map
      }
    });

    // CALLING PROPS FOR REDUX
    this.props.mapAdded("Elevation", map); // TODO: rename these (addMap)
    this.props.terrainAdded(this.terrain); // TODO: rename these (addTerrain)
  
    // MARK SKETCH AS READY!
    this.props.onReady();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  handleResize = () => {
    this.width  = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    this.stats.begin();

      for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].update();
      }

      this.renderer.render(this.scene, this.camera);

      this.state.maps.elevation.render();
    this.stats.end();
  }

  render() {
    return (
      <div id="APP" ref={mount => { this.mount = mount }}/>
    )
  }
}
