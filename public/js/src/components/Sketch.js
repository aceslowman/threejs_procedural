import * as THREE from 'three';
import React from 'react';
import dat from "dat.gui";
import Toolbar from './Toolbar'

import StandardManager from '../sketch/system/StandardManager';

// PROCEDURAL TOOLS IMPORTS
import ProceduralMap from '../sketch/entities/procedural/ProceduralMap';
import ProceduralTerrain from '../sketch/entities/procedural/terrain/ProceduralTerrain';

// SHADER IMPORTS
import FractalNoise from "../sketch/shaders/fractalnoise.js";
import FractalWarp from "../sketch/shaders/fractalwarp.js";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);

    let manager = new StandardManager({ scene: { background: 'black' } });

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

        if(prop_pass != prevProps.passes[p]){
          let pass = this.getPassById(prop_pass.id);

          Object.assign(pass.material.defines, prop_pass.defines);
          Object.assign(pass.material.uniforms, prop_pass.uniforms);
          pass.material.needsUpdate = true;
        }
      }

      this.state.maps.elevation.render();
      this.terrain.displace();
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

    this.props.mapAdded("Elevation", map);

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

    this.setState({
      maps: {
        elevation: map
      }
    });
  }

  setupShaderPasses(map, passes) {
    for(let pass of passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      map.composer.addPass(p);
    }

    map.composer.swapBuffers();
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
    this.state.manager.update();
    this.state.maps.elevation.render();
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
