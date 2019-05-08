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
      map: {
        elevation: ''
      }
    }
  }

  componentDidUpdate(){
    console.log("PROP NUMBER", this.props.number);
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
      map: {
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

    // this.setupShaderGraphDisplay(map);
  }

  // this is primarily TOOLBOX relevant
  setupShaderGraphDisplay(map) {
    let container = document.createElement('div');
    let p_ol = document.createElement('ol');
    container.id = 'ShaderGraph';

    for(let pass of map.composer.passes){
      let p_li = document.createElement('li');
      let gui = new dat.GUI({ autoPlace: false });
      gui.pass = gui.addFolder(pass.material.name);

      gui.pass.add(pass, 'renderToScreen', 0, 1)
      .onChange(()=>{
        pass.material.needsUpdate = true;
        this.terrain.displace();
      });

      gui.pass.add(pass, 'enabled', 0, 1)
      .onChange(()=>{
        pass.material.needsUpdate = true;
        this.terrain.displace();
      });

      gui.pass.defines = gui.pass.addFolder('Defines');
      let defines = pass.material.defines;
      // TODO: I do need some kind of limit on these defines.
      for(let define in defines){
        gui.pass.add(defines, define).min(0).max(20).step(1).name(define)
          .onChange(()=>{
            pass.material.needsUpdate = true;
            this.terrain.displace();
          });
      }

      gui.pass.uniforms = gui.pass.addFolder('Uniforms');
      let uniforms = pass.material.uniforms;
      for(let uniform in uniforms){
        let isNumber = typeof uniforms[uniform].value === 'number';
        if(isNumber){
          gui.pass.add(uniforms[uniform], "value").step(0.001).name(uniform)
            .onChange(()=>{
              this.terrain.displace();
            });
        }else{
          gui.pass.add(uniforms[uniform], "value").name(uniform)
            .onChange(()=>{
              this.terrain.displace();
            });
        }
      }

      p_li.appendChild(gui.domElement);
      p_ol.appendChild(p_li);
    }

    container.appendChild(p_ol);
    document.getElementById('TOOLBAR').appendChild(container);
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
    this.state.map.elevation.render();
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
