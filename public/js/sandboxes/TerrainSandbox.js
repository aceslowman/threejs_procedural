import * as THREE from 'three';
import React from 'react';
import StandardManager from '../system/StandardManager';
import World from '../entities/procedural/World';
import PerspectiveCamera from '../entities/PerspectiveCamera';
import OrthographicCamera from '../entities/OrthographicCamera';

export default class TerrainSandbox extends React.Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.manager = new StandardManager({
      scene: {
        background: 'black'
      }
    });

    this.world = new World(this.manager);

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
