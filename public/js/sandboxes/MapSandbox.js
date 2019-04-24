import * as THREE from 'three';
import React from 'react';
import StandardManager from '../system/StandardManager';
import ProceduralMap from '../entities/procedural/Map';

export default class MapSandbox extends React.Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.manager = new StandardManager({
      scene: {
        background: 'black'
      }
    });

    const map = new ProceduralMap(this.manager, {
      width: 256,
      height: 256,
    });

    map.render();
    map.setupDisplay("Test Map", new THREE.Vector3(0,0,0));

    window.addEventListener('resize', this.handleResize);

    this.mount.appendChild(this.manager.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.manager.gui.destroy();
    window.removeEventListener('resize', this.handleResize);
    this.stop();
    this.mount.removeChild(this.manager.renderer.domElement);
  }

  handleResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.manager.onWindowResize(width, height);
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
    this.manager.update();
  }

  render() {
    return (
      <div
        className="vis"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}
