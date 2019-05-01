import * as THREE from 'three';
import React from 'react';

export default class TemplateView extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);

    this.state = {
      manager: props.manager
    }
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    // do stuff

    window.addEventListener('resize', this.handleResize);

    this.mount.appendChild(this.state.manager.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.state.manager.gui.destroy();
    window.removeEventListener('resize', this.handleResize);
    this.stop();
    this.mount.removeChild(this.state.manager.renderer.domElement);
  }

  handleResize = () => {
    const width = this.mount.clientWidth;
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
  }

  render() {
    return (
      <div
        id="APP"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}
