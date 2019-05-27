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

  updateActiveCamera(uuid){
    /* There could be a performance boost here by only copying over the 
    parameters that have changed. Not sure how that works but maybe it's 
    a matter of doing some kind of diff. I am imagining that 
    loader.parse() could be a bottleneck. */

    const loader = new THREE.ObjectLoader();
    const obj = loader.parse(this.props.cameras.byId[uuid]);

    this.camera = obj;
    this.camera.updateProjectionMatrix();

    this.camera.up.set(0,0,1);

    this.orbitControls.object = this.camera;
    this.orbitControls.update(); 
  }

  setupCameras(){
    /* here, I can create several cameras and immediately send them to 
      state as serialized objects. then, I could just worry about 
      maintaining an 'active' camera at any given time. */
    let ortho = new THREE.OrthographicCamera(
      this.width / - 2, 
      this.width / 2, 
      this.height / 2, 
      this.height / - 2, 
      0, 
      2000
    );
    ortho.name = "Default Orthographic";
    ortho.zoom = 2;
    ortho.position.z = 999;
    ortho.up.set(0,0,1);
    ortho.updateProjectionMatrix();
    ortho.updateMatrixWorld();

    let perspective = new THREE.PerspectiveCamera(
      75,            // fov
      this.width / this.height,   // aspect
      0.01,          // near
      2000           // far
    );
    perspective.name = "Default Perspective";
    perspective.zoom = 2;
    perspective.position.z = 999;
    perspective.up.set(0,0,1);
    perspective.updateProjectionMatrix();
    perspective.updateMatrixWorld();

    // TODO: currently trying to figure out whether or not to
    // initialize in the reducer

    // send to store
    this.props.addCamera(ortho);
    this.props.addCamera(perspective);

    // set default camera
    this.camera = perspective;
    this.props.setActiveCamera(perspective.uuid);

    this.setupOrbit();
  }

  //ORBIT CONTROLS------------------------------------------------------
  setupOrbit() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    // this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.8;
    // this.orbitControls.panningMode = THREE.HorizontalPanning; // default is THREE.ScreenSpacePanning
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 1000;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    // this.orbitControls.autoRotate = true;

    this.props.addOrbit(this.orbitControls);
  }

  updateOrbit() {
    // this.orbitControls.enableDamping = this.orbitControls.
  }
  
  //TERRAIN------------------------------------------------------
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

  //LIFECYCLE------------------------------------------------------
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

    let active_cam_uuid = this.props.cameras.active;

    // if the active camera has changed...
    if(this.props.cameras.active != prevProps.cameras.active || 
        this.props.cameras.byId[active_cam_uuid] != prevProps.cameras.byId[active_cam_uuid]){
      this.updateActiveCamera(active_cam_uuid);
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

  //LISTENERS-----------------------------------------------------
  handleResize = () => {
    this.width  = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  //--------------------------------------------------------------
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
