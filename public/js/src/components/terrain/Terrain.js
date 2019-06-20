import React from 'react';
import { withRouter, Route} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import ProceduralMap from '../map/ProceduralMap';

import FractalNoise from "../../shaders/FractalNoise.js";
import FractalWarp from "../../shaders/FractalWarp.js";

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

    this.geometry  = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.detail,
      this.detail
    );

    this.state = {
      ready: false,
    }
  }

  componentDidMount() {
    this.initializeMesh();
    this.setupDebug();
    this.ready();
  }

  ready() {
    this.setState({ ready: true });
    this.props.terrainReady(this);
  }

  initializeMesh() {
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupDebug() {
    var helper = new THREE.Box3Helper(this.geometry.boundingBox, 0xffff00);
    this.scene.add(helper);
  }

  displaceGeometry(displacement_buffer, width, height) {
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;
    
    for (let i = 0; i < count; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (width - 1.0));
      const y = Math.floor(v * (height - 1.0));
      const d_index = (y * height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);
    }

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    this.geometry.translate(0, 0, -this.geometry.boundingBox.min.z);
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

  render() {
    const {classes} = this.props;
    
    return (
      <Route path="/terrain/" render={() => (
        <React.Fragment>
          <ProceduralMap
            name="Elevation"
            renderer={this.renderer}
            width={this.width}
            height={this.height}
            displaceGeometry={(d,w,h)=>this.displaceGeometry(d,w,h)}
            >
            <FractalNoise />
            {/* <FractalWarp /> */}
          </ProceduralMap>
        </React.Fragment>
      )} />
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));