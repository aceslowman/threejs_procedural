import React from 'react';
import SketchContext from '../../SketchContext';
import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import ProceduralMap from '../map/ProceduralMap';

import FractalNoise from "../map/shaders/FractalNoise.js";
import FractalWarp from "../map/shaders/FractalWarp.js";

import { Divider } from '@material-ui/core'; 
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AnimationMixer } from 'three';

let AMMO = '';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '4px 4px 16px 4px'
  }
});

class Terrain extends React.Component {
  static contextType = SketchContext;

  constructor(props, context) {  
    super(props, context);

    this.renderer  = context.renderer;
    this.scene     = context.scene;
    this.seed      = context.seed;
    
    this.width     = props.width;
    this.height    = props.height;
    this.detail    = props.detail;
    this.amplitude = props.amplitude;

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

    this.geometry.rotateX(-Math.PI / 2.);
    this.geometry.computeBoundingBox();

    this.state = {
      detail: props.detail,
      width: props.width,
      height: props.height,
      amplitude: props.amplitude
    }
  }

  //------------------------------------------------------------------------
  componentWillMount() {
    this.initializeMesh();
    this.setupDebug(); 
  }

  //------------------------------------------------------------------------
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
    this.displaceGeometry();;
  }

  //------------------------------------------------------------------------
  initializeMesh() {
    this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide, wireframe: false});

    let mirrorMaterialSmooth = new THREE.MeshPhongMaterial({
      color: 0xffaa00,
      specular: 0x222222,
      shininess: 10000,
      vertexColors: THREE.NoColors,
      flatShading: false,
      // wireframe: true,
      // side: THREE.DoubleSide
    });
    mirrorMaterialSmooth.mirror = true;
    mirrorMaterialSmooth.reflectivity = 0.3;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  displaceGeometry(buffer) {
    const displacement_buffer = buffer;

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

      // change the Y position
      positions[i * 3 + 1] = (r * this.amplitude);
    }

    this.geometry.getAttribute('normal').needsUpdate = true;
    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.getAttribute('uv').needsUpdate = true;

    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    /*
      translate the geometry so that the bottom of the boundingBox
      sits nicely ON TOP of the 0 plane. this seems to be necessary
      for the proper functioning of the physics.
    */
    this.geometry.translate(0,-this.geometry.boundingBox.min.y,0);

    // https://github.com/mrdoob/three.js/issues/9377
    /*
      when a standard buffergeometry is serialized using.toJSON, all 
      attributes are omitted if geometry.parameters exists
    */

    this.heightData = positions;
    this.generateHeightfield();
  }

  generateHeightfield(){ 
    // --------------------------------GENERATE GROUNDSHAPE------------------------------------------

    let terrainWidth        = this.state.detail + 1;                 // detail of plane
    let terrainDepth        = this.state.detail + 1;                 // detail of plane
    let terrainMinHeight    = this.mesh.geometry.boundingBox.min.y;
    let terrainMaxHeight    = this.mesh.geometry.boundingBox.max.y;
    let terrainWidthExtents = this.state.width;                      // width of plane
    let terrainDepthExtents = this.state.height;                     // depth of plane

    let heightScale = 1;
    let upAxis = 1;
    let hdt = "PHY_FLOAT";
    let flipQuadEdges = false;

    // Creates height data buffer in Ammo heap
    let ammoHeightData = this.context.physics.Ammo._malloc(4 * terrainWidth * terrainDepth);

    let p = 0;
    let p2 = 0;
    for (let x = 0; x < terrainDepth; x++) {
      for (let y = 0; y < terrainWidth; y++) {
        // write 32-bit float data to memory
        this.context.physics.Ammo.HEAPF32[ammoHeightData + p2 >> 2] = this.heightData[p + 1];

        // 3, to jump through x,y,z groups
        p += 3; 
        // 4 bytes/float
        p2 += 4;
      }
    }

    // Creates the heightfield physics shape
    let heightFieldShape = new Ammo.btHeightfieldTerrainShape(
      terrainWidth,
      terrainDepth,

      ammoHeightData,

      heightScale,
      terrainMinHeight,
      terrainMaxHeight,

      upAxis,
      hdt,
      flipQuadEdges
    );

    let scaleX = terrainWidthExtents / terrainWidth;
    let scaleZ = terrainDepthExtents / terrainDepth;
    
    heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));
    heightFieldShape.setMargin(0.05);

    //---------------------------GENERATE RIGIDBODY-------------------------------------------------
    let groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    // Shifts the terrain, since bullet re-centers it on its bounding box.
    groundTransform.setOrigin(new Ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) /2, 0));
    
    let groundMass = 0;
    let groundLocalInertia = new Ammo.btVector3(0, 0, 0);
    let groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
    this.groundBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(
      groundMass, 
      groundMotionState, 
      heightFieldShape, 
      groundLocalInertia
    ));
    this.context.physics.physicsWorld.addRigidBody(this.groundBody);
  }

  setupDebug() {
    let helper = new THREE.Box3Helper(this.geometry.boundingBox, 0xffff00);
    this.scene.add(helper);
  }

  //------------------------------------------------------------------------
  globalBoundsCheck(a) {
    let h_w = (this.width / 2);
    let h_h = (this.height / 2);

    if (a.x >= h_w || a.x <= -h_w || a.y >= h_h || a.y <= -h_h) {
      if (this.verbose) console.warn('endpoint was out of bounds', a);
      return false;
    }

    return true;
  }

  //------------------------------------------------------------------------
  render() {
    const {classes} = this.props;

    return (
      <Paper className={classes.root} style={{display: this.props.display ? 'block' : 'none'}}>
        <Grid
          container
          justify={'space-around'}
          alignItems={'center'}
          spacing={16}
        >
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Terrain</Typography>
            <Divider />
          </Grid>
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
            width={this.props.width}
            height={this.props.height}
            displaceGeometry={(b) => this.displaceGeometry(b)}
            seed={this.seed}
            onRef={ref => this.elevation = ref} // assign ref so that displacement 
                                                // can be done without props
          >
            <FractalNoise
              needsSwap={true} 
              octaves={8}
            />                 
            <FractalWarp
              needsSwap={true} 
              octaves={8}
            />
          </ProceduralMap>
          </Grid>
      </Paper>
    )}
}

export default withStyles(styles)(Terrain);