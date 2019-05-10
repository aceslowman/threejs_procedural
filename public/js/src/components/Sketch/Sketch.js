import * as THREE from 'three';
import React from 'react';
import Toolbar from '../Toolbar/Toolbar'
import Stats from "stats-js";

import StandardManager from '../../sketch/system/StandardManager';

// PROCEDURAL TOOLS IMPORTS
import ProceduralMap from '../../sketch/entities/procedural/ProceduralMap';
import ProceduralTerrain from '../../sketch/entities/procedural/terrain/ProceduralTerrain';

// SHADER IMPORTS
import FractalNoise from "../../sketch/shaders/fractalnoise.js";
import FractalWarp from "../../sketch/shaders/fractalwarp.js";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);

    let manager = new StandardManager({ scene: { background: 'black' } });
    manager.camera.getCamera().name = "Primary Camera";

    this.state = {
      manager: manager,
      maps: {
        elevation: ''
      }
    }
  }

  getPassById(id){
    for(let m in this.state.maps){
      for(let p in this.state.maps[m].composer.passes){
        let pass = this.state.maps[m].composer.passes[p];

        if(pass.material.name == id){
          return pass;
        }
      }
    }
  }

  componentDidUpdate(prevProps) {

    if(this.props.passes != prevProps.passes){ 
      for(let p in this.props.passes){ 
        let prop_pass = this.props.passes[p];
        let prevPass = prevProps.passes[p];

        if(prop_pass != prevPass && prevPass){
          let pass = this.getPassById(prop_pass.id);

          let params_changed   = prop_pass.params   != prevPass.params;
          let defines_changed  = prop_pass.defines  != prevPass.defines;
          let uniforms_changed = prop_pass.uniforms != prevPass.uniforms;

          if (params_changed) {
            pass.enabled = prop_pass.params.enabled;
            pass.renderToScreen = prop_pass.params.renderToScreen;
          }

          if (defines_changed){
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

    if(this.props.cameras != prevProps.cameras){ //TODO: insufficient
      this.state.manager.camera.getCamera().setFocalLength(this.props.cameras["Primary Camera"].fov); 
    }

    if(this.props.terrain != prevProps.terrain){
      console.log('terrain changed!');
      //TODO: change terrain parameters and reset mesh
    }
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    let map = new ProceduralMap(this.state.manager, {width: 512, height: 512});

    this.setupShaderPasses(map, [
      new FractalNoise(8),
      new FractalWarp(4)
    ]);

    map.render();

    // SETUP TERRAIN
    this.terrain = new ProceduralTerrain(this.state.manager, {
      width: 512,
      height: 512,
      detail: 512.0,
      amplitude: 300,
      elevation: map
    });

    // SETUP LISTENERS
    window.addEventListener('resize', this.handleResize);

    this.mount.appendChild(this.state.manager.renderer.domElement);
    this.start();

    this.terrain.setup();
    this.terrain.setupDebug();

    this.setupStats();

    this.setState({
      maps: {
        elevation: map
      }
    });

    this.props.mapAdded("Elevation", map);
    this.props.cameraAdded(this.state.manager.camera.getCamera());
    this.props.terrainAdded(this.terrain);
  }

  setupShaderPasses(map, passes) {
    for(let pass of passes) {
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

  componentWillUnmount() {
    this.state.manager.gui.destroy();
    window.removeEventListener('resize', this.handleResize);
    this.stop();
    this.mount.removeChild(this.state.manager.renderer.domElement);
  }

  handleResize = () => {
    const width  = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.state.manager.onWindowResize(width, height);
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
    this.state.manager.update();
    this.state.maps.elevation.render();
    this.stats.end();
  }

  render() {
    return (
      <div className="container">
        <Toolbar/>
        <div id="APP" ref={mount => { this.mount = mount }}/>
      </div>
    )
  }
}
