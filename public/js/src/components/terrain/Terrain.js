import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MapTools from './partials/MapTools';

import * as THREE from 'three';

import ProceduralMap from '../../procedural/ProceduralMap';

import FractalNoise from "../../shaders/fractalnoise.js";
import FractalWarp from "../../shaders/fractalwarp.js";

const styles = theme => ({
  root: {
    padding: 8,
    margin: '4px 4px 16px 4px'
  }
});

class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.renderer  = props.renderer;
    this.scene     = props.scene;

    this.width     = props.width;
    this.height    = props.height;
    this.detail    = props.detail;
    this.amplitude = props.amplitude;
    this.seed      = Math.random() * 10000;

    this.verbose   = false;

    this.state = {
      ready: false,
      geometry: new THREE.PlaneBufferGeometry(
        this.width,
        this.height,
        this.detail,
        this.detail
      ),
      maps: {
        elevation: new ProceduralMap(this.renderer, {
          name: "Elevation",
          width: this.width,
          height: this.height,
          passes: [
            new FractalNoise(8, this.seed),
            new FractalWarp(4, this.seed)
          ]
        }),
        colors: new ProceduralMap(this.renderer, {
          name: "Colors",
          width: this.width,
          height: this.height,
          passes: [
            new FractalNoise(8, this.seed),
            new FractalWarp(4, this.seed)
          ]
        }),
      }
    }
  }

  componentDidMount() {
    // this.initializeElevation();
    // this.initializeColors();
    this.initializeMesh();

    this.setupDebug();

    this.ready();
  }

  ready() {
    this.setState({ ready: true });
    this.props.terrainReady(this);
  }

  initializeMesh() {

    this.displaceGeometry();
    // this.material = new THREE.MeshBasicMaterial({
    //     map: this.colors.target,
    // });

    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.state.geometry, this.material);

    this.scene.add(this.mesh);
  }

  update() {
    this.state.maps.elevation.render();
  }

  setupDebug() {
    var helper = new THREE.Box3Helper(this.state.geometry.boundingBox, 0xffff00);
    this.scene.add(helper);
  }

  displaceGeometry() {
    const displacement_buffer = this.state.maps.elevation.getBufferArray();
    const positions = this.state.geometry.getAttribute('position').array;
    const uvs = this.state.geometry.getAttribute('uv').array;
    const count = this.state.geometry.getAttribute('position').count;

    for (let i = 0; i < count; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (this.state.maps.elevation.width - 1.0));
      const y = Math.floor(v * (this.state.maps.elevation.height - 1.0));
      const d_index = (y * this.state.maps.elevation.height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);

      if (!r) {
        // TODO: implement some sort of check that prevents this.
        console.warn('cannot find value in displacement buffer');
      }
    }

    this.state.geometry.getAttribute('position').needsUpdate = true;
    this.state.geometry.computeVertexNormals();
    this.state.geometry.computeFaceNormals();
    this.state.geometry.computeBoundingBox();
    this.state.geometry.computeBoundingSphere();

    this.state.geometry.translate(0, 0, -this.state.geometry.boundingBox.min.z);
  }

  globalBoundsCheck(a) {
    let h_w = (this.width / 2);
    let h_h = (this.height / 2);

    if (a.x >= h_w || a.x <= -h_w || a.y >= h_h || a.y <= -h_h) {
      if (this.verbose) console.warn('endpoint was out of bounds', a);
      return false;
    }

    return true;
  }

  // GUI ----------------------------------------------------------------

  handleMapSelect(map){ 
    this.props.updateDiagramActiveMap(map)
  }

  render() {
    const {classes} = this.props;

    let maps = [];

    for (let m in this.state.maps) {
      let map = this.state.maps[m];
      maps.push(<MapTools key={m} map={map} {...this.props} selected={false} selectMap={(e) => this.handleMapSelect(e)} />);
    }
    
    return (
      <div className="subnavigation">
        {maps}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));