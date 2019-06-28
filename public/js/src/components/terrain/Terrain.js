import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import ProceduralMap from '../map/ProceduralMap';

import FractalNoise from "../../shaders/FractalNoise.js";
import FractalWarp from "../../shaders/FractalWarp.js";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

    let plane = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.detail,
      this.detail
    );

    this.geometry = new THREE.BufferGeometry();
    this.geometry.copy(plane);  // this is important for RaytracingRenderer
                                // as it will not use position from a
                                // PlaneBufferGeometry()
    this.state = {
      ready: false,
      detail: props.detail,
      width: props.width,
      height: props.height
    }
  }

  updateMeshDetail(v) {
    this.setState({detail: v});

    this.scene.remove(this.mesh)

    let plane = new THREE.PlaneBufferGeometry(
      this.state.width,
      this.state.height,
      v,
      v    
    );

    this.geometry = new THREE.BufferGeometry();
    this.geometry.copy(plane);  // this is important for RaytracingRenderer
                                // as it will not use position from a
                                // PlaneBufferGeometry()
    this.initializeMesh();
    this.displaceGeometry();
  }

  updateMeshSize(v) {
    this.setState({width: v, height: v});

    this.scene.remove(this.mesh)

    let plane = new THREE.PlaneBufferGeometry(
      v,
      v,
      this.state.detail,
      this.state.detail
    );

    this.geometry = new THREE.BufferGeometry();
    this.geometry.copy(plane);  // this is important for RaytracingRenderer
                                // as it will not use position from a 
                                // PlaneBufferGeometry()
    this.initializeMesh();
    this.displaceGeometry();
  }

  componentDidMount() {
    this.initializeMesh();
    this.setupDebug();
    this.mesh.updateMatrix();
    this.ready();
  }

  ready() {
    this.setState({ ready: true });
    this.props.terrainReady(this);
  }

  initializeMesh() {
    this.material = new THREE.MeshNormalMaterial();

    var mirrorMaterialSmooth = new THREE.MeshPhongMaterial({
      color: 0xffaa00,
      specular: 0x222222,
      shininess: 10000,
      vertexColors: THREE.NoColors,
      flatShading: false
    });
    // mirrorMaterialSmooth.mirror = true;
    // mirrorMaterialSmooth.reflectivity = 0.3;

    this.mesh = new THREE.Mesh(this.geometry, mirrorMaterialSmooth);
    this.scene.add(this.mesh);
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
      const x = Math.floor(u * (this.width - 1.0));
      const y = Math.floor(v * (this.height - 1.0));
      const d_index = (y * this.height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);
    }

    this.geometry.getAttribute('normal').needsUpdate = true;
    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.getAttribute('uv').needsUpdate = true;

    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    // https://github.com/mrdoob/three.js/issues/9377
    /*
      when a standard buffergeometry is serialized using.toJSON, all 
      attributes are omitted if geometry.parameters exists
    */
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
      <React.Fragment>
        <Paper className={classes.root}>
          <Grid container justify={'center'} alignItems={'center'} alignContent='center' spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Mesh Settings</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="detail-helper">size</InputLabel>
                <Select
                  fullWidth
                  value={this.state.width}
                  onChange={(e) => this.updateMeshSize(e.target.value)}
                >
                  <MenuItem value={32}>32</MenuItem>
                  <MenuItem value={64}>64</MenuItem>
                  <MenuItem value={128}>128</MenuItem>
                  <MenuItem value={256}>256</MenuItem>
                  <MenuItem value={512}>512</MenuItem>
                  <MenuItem value={1024}>1024</MenuItem>
                </Select>
                <FormHelperText>dimensions of mesh</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="detail-helper">detail</InputLabel>
                <Select
                  fullWidth
                  value={this.state.detail}
                  onChange={(e)=>this.updateMeshDetail(e.target.value)}
                >
                  <MenuItem value={32}>32</MenuItem>
                  <MenuItem value={64}>64</MenuItem>
                  <MenuItem value={128}>128</MenuItem>
                  <MenuItem value={256}>256</MenuItem>
                  <MenuItem value={512}>512</MenuItem>
                  <MenuItem value={1024}>1024</MenuItem>
                </Select>
                <FormHelperText>resolution of displacement</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <ProceduralMap
          name="Elevation"
          renderer={this.renderer}
          width={this.width}
          height={this.height}
          displaceGeometry={() => this.displaceGeometry()}
          seed={this.seed}
          onRef={ref => this.elevation = ref}
        >
          <FractalNoise 
            clear={false}
            enabled={true} 
            renderToScreen={false} 
            needsSwap={true} // when false, map displays. warp does not. when true, it's fully responsive to state change?
          />                 
          <FractalWarp 
            clear={false}
            enabled={true} 
            renderToScreen={true} 
            needsSwap={true}
          />
        </ProceduralMap>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Terrain);