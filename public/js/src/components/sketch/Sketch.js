import * as THREE from 'three';
import React from 'react';
import Stats from "stats-js";

// IN PROGRESS
import Camera from '../camera/Camera';
import Terrain from '../terrain/Terrain';

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);
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

  //TERRAIN------------------------------------------------------

  // getPassById(id) { // UTIL
  //   for (let m in this.state.maps) {
  //     for (let p in this.state.maps[m].composer.passes) {
  //       let pass = this.state.maps[m].composer.passes[p];

  //       if (pass.material.name == id) {
  //         return pass;
  //       }
  //     }
  //   }
  // }

  //LIFECYCLE------------------------------------------------------
  componentDidUpdate(prevProps) {
    // if (this.props.passes != prevProps.passes) {
    //   for (let p in this.props.passes) {
    //     let prop_pass = this.props.passes[p];
    //     let prevPass = prevProps.passes[p];

    //     if (prop_pass != prevPass && prevPass) {
    //       let pass = this.getPassById(prop_pass.id);

    //       let params_changed = prop_pass.params != prevPass.params;
    //       let defines_changed = prop_pass.defines != prevPass.defines;
    //       let uniforms_changed = prop_pass.uniforms != prevPass.uniforms;

    //       if (params_changed) {
    //         pass.enabled = prop_pass.params.enabled;
    //         pass.renderToScreen = prop_pass.params.renderToScreen;
    //       }

    //       if (defines_changed) {
    //         Object.assign(pass.material.defines, prop_pass.defines);
    //         pass.material.needsUpdate = true;
    //       }

    //       if (uniforms_changed) {
    //         Object.assign(pass.material.uniforms, prop_pass.uniforms);
    //       }
    //     }
    //   }

    //   this.state.maps.elevation.render(); //TODO: update only the map that changed.
    //   this.terrain.displace(); //TODO: displace only if necessary
    // }

    // let active_cam_uuid = this.props.cameras.active;

    // if the active camera has changed...
    // if (this.props.cameras.active != prevProps.cameras.active ||
      // this.props.cameras.byId[active_cam_uuid] != prevProps.cameras.byId[active_cam_uuid]) {
      // this.updateActiveCamera(active_cam_uuid);
    // }
  }

  componentDidMount() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    console.log([this.width, this.height]);

    this.entities = [];

    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);
    this.start();

    this.scene = new THREE.Scene({
      background: 'green'
    });

    // IN PROGRESS
    this.camera  = new Camera(this.renderer, this.width, this.height);
    this.terrain = new Terrain(this.renderer, this.scene, {
      width: 512,
      height: 512,
      detail: 512,
      amplitude: 150
    });
    
    this.setupStats();

    // sketch marked 'ready' for GUI to render.
    this.props.onReady();

    // SETUP LISTENERS
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    this.mount.removeEventListener('resize', this.handleResize);
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  //LISTENERS-----------------------------------------------------
  handleResize = () => {
    this.width  = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.camera.getCamera().aspect = this.width / this.height;
    this.camera.getCamera().updateProjectionMatrix();

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

      this.renderer.render(this.scene, this.camera.getCamera());

      this.terrain.update();
    this.stats.end();
  }

  render() {
    return (
      <div id="APP" ref={mount => { this.mount = mount }}/>
    )
  }
}
