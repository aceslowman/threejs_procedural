import * as THREE from 'three';
import React from 'react';
import dat from "dat.gui";
import Toolbar from './Toolbar'

import StandardManager from './system/StandardManager';

// PROCEDURAL TOOLS IMPORTS
import ProceduralMap from './entities/procedural/ProceduralMap';
import ProceduralTerrain from './entities/procedural/terrain/ProceduralTerrain';

// SHADER IMPORTS
import FractalNoise from "./shaders/fractalnoise.js";
import FractalWarp from "./shaders/fractalwarp.js";

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);

    let manager = new StandardManager({ scene: { background: 'black' } });

    this.state = {
      manager: manager,
      map: {
        elevation: new ProceduralMap(manager, {width: 512, height: 512})
      }
    }
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.setupShaderPasses(this.state.map.elevation, [
      new FractalNoise(8),
      new FractalWarp(4)
    ]);

    this.state.map.elevation.render();

    // SETUP TERRAIN
    this.terrain = new ProceduralTerrain(this.state.manager, {
      width: 256,
      height: 256,
      detail: 256.0,
      amplitude: 300,
      elevation: this.state.map.elevation
    });

    // SETUP LISTENERS
    window.addEventListener('resize', this.handleResize);

    this.mount.appendChild(this.state.manager.renderer.domElement);
    this.start();

    this.terrain.setup();
    this.terrain.setupDebug();
  }

  setupShaderPasses(map, passes) {
    for(let pass of passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      map.composer.addPass(p);
    }

    map.composer.swapBuffers();

    this.setupShaderGraphDisplay(map);
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
        console.log();
        // if(uniforms[uniform] )
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
        <Toolbar manager={this.state.manager} />
        <div id="APP" ref={mount => { this.mount = mount }}/>
      </div>
    )
  }
}
