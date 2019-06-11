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

    this.renderer = props.renderer;
    this.scene = props.scene;

    this.width = props.width;
    this.height = props.height;
    this.detail = props.detail;
    this.amplitude = props.amplitude;
    this.seed = Math.random() * 10000;

    this.verbose = false;

    this.initialize();

    this.state = {
      ready: false
    }
  }

  componentDidMount() {
    this.ready();
  }

  ready() {
    this.setState({ ready: true });
    this.props.terrainReady(this);
  }

  initialize() {
    this.initializeElevation();
    this.initializeColors();
    this.initializeMesh();

    this.setupDebug();
  }

  initializeElevation() {
    let map = new ProceduralMap(this.renderer, {
      width: this.width,
      height: this.height
    });

    let passes = [
      new FractalNoise(8, this.seed),
      new FractalWarp(4, this.seed)
    ];

    for (let pass of passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      map.composer.addPass(p);
    }

    map.composer.swapBuffers();
    map.render();

    this.elevation = map;
    this.props.addMap(map, 'Elevation');
  }

  initializeColors() {
    let map = new ProceduralMap(this.renderer, {
      width: this.width,
      height: this.height
    });

    let passes = [
      new FractalNoise(8, this.seed),
      new FractalWarp(4, this.seed),
      // TODO: implement a lookup table shader!
    ];

    for (let pass of passes) {
      let p = new THREE.ShaderPass(pass.shaderMaterial);
      map.composer.addPass(p);
    }

    map.composer.swapBuffers();
    map.render();

    this.colors = map;
    this.props.addMap(map, 'Colors');
  }

  initializeMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.detail,
      this.detail
    );

    this.displaceGeometry();

    // this.material = new THREE.MeshBasicMaterial({
    //     map: this.colors.target,
    // });

    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  update() {
    this.elevation.render();
  }

  setupDebug() {
    var helper = new THREE.Box3Helper(this.geometry.boundingBox, 0xffff00);
    this.scene.add(helper);
  }

  displaceGeometry() {
    const displacement_buffer = this.elevation.getBufferArray();
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;

    for (let i = 0; i < count; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (this.elevation.width - 1.0));
      const y = Math.floor(v * (this.elevation.height - 1.0));
      const d_index = (y * this.elevation.height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);

      if (!r) {
        // TODO: implement some sort of check that prevents this.
        console.warn('cannot find value in displacement buffer');
      }
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

  // GUI ----------------------------------------------------------------

  handleMapSelect(map){ 
    this.props.updateDiagramActiveMap(map)
  }

  assembleMaps(){
    let maps = [];

    for(let m in this.props.maps){
      let map = this.props.maps[m];
      let selected;
      this.props.diagrams && this.props.diagrams.activeMap == m ? selected = true : selected = false; 

      maps.push(<MapTools key={m} map={map} {...this.props} selected={selected} selectMap={(e)=>this.handleMapSelect(e)}/>);
    }

    return maps;
  }

  render() {
    const {classes} = this.props;

    return (
      <div className="subnavigation">
        {this.assembleMaps()}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));