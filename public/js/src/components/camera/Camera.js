import React from 'react';
import * as THREE from 'three';
import OrbitControls from "../../utilities/OrbitControls.js";

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

// import camera common components
import CameraViews from './partials/common/CameraViews';
import CameraCommons from './partials/common/CameraCommons';

// import subgui
import OrthographicCameraTools from './partials/OrthographicCameraTools';
import PerspectiveCameraTools from './partials/PerspectiveCameraTools';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '8px 4px'
  }
});

class Camera extends React.Component {
  constructor(props){
    super(props);

    this.renderer = props.renderer;
    this.scene    = props.scene;
    this.width    = props.width;
    this.height   = props.height;

    // TODO: fix initial width and height.

    let ortho = new THREE.OrthographicCamera(
      this.width / - 2,
      this.width / 2,
      this.height / 2,
      this.height / - 2,
      0,
      2000
    );

    let persp = new THREE.PerspectiveCamera(
      75,                         // fov
      this.width / this.height,   // aspect
      0.01,                       // near
      2000                        // far
    );

    this.state = { 
      ready: false, 
      cameras: {
        ortho: ortho,
        perspective: persp
      }, 
      activeCamera: persp
    }
  }

  componentDidMount(){
    this.state.cameras.ortho.name = "Default Orthographic";
    this.state.cameras.ortho.zoom = 2;
    this.state.cameras.ortho.position.z = 999;
    this.state.cameras.ortho.up.set(0, 0, 1);
    this.state.cameras.ortho.updateProjectionMatrix();
    this.state.cameras.ortho.updateMatrixWorld();

    this.state.cameras.perspective.name = "Default Perspective";
    this.state.cameras.perspective.zoom = 2;
    this.state.cameras.perspective.position.z = 999;
    this.state.cameras.perspective.up.set(0, 0, 1);
    this.state.cameras.perspective.updateProjectionMatrix();
    this.state.cameras.perspective.updateMatrixWorld();

    this.setupOrbit();
    this.registerListeners();

    this.ready();
  }

  ready(){
    this.setState({ready: true, activeCamera: this.state.cameras.perspective});
    this.props.cameraReady(this.state.cameras.perspective);
  }

  setupOrbit() {
    this.orbitControls = new OrbitControls(
      this.state.activeCamera,
      this.renderer.domElement
    );

    this.orbitControls.dampingFactor = 0.8;
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 1000;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
  }

  changeActiveCamera(type){
    switch(type){
      case "OrthographicCamera": 
        this.setState({activeCamera: this.state.cameras.ortho});
        this.props.cameraChange(this.state.cameras.ortho);
        this.orbitControls.object = this.state.cameras.ortho;
        break;
      case "PerspectiveCamera":
        this.setState({activeCamera: this.state.cameras.perspective});
        this.props.cameraChange(this.state.cameras.perspective);
        this.orbitControls.object = this.state.cameras.perspective;
        break;
    }
  }

  //LISTENERS-----------------------------------------------------
  registerListeners() {
    window.addEventListener('resize', this.handleResize);
  }

  removeListeners() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.state.activeCamera.aspect = this.props.width / this.props.height;
    this.state.activeCamera.left = this.props.width / - 2;
    this.state.activeCamera.right = this.props.width / 2;
    this.state.activeCamera.top = this.props.height / 2;
    this.state.activeCamera.bottom = this.props.height / - 2;
    this.state.activeCamera.updateProjectionMatrix();
  }

  render(){
    const { classes } = this.props;

    return (
      <div className="subnavigation">
        {this.state.ready && (<CameraViews camera={this.state.activeCamera} view="ANGLE" {...this.props} />)}

        {this.state.ready && (
        <Paper className={classes.root}>
          <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Camera Type</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.state.activeCamera.type == "OrthographicCamera" ? 'primary' : 'default'} onClick={() => this.changeActiveCamera("OrthographicCamera")} fullWidth variant="outlined">Orthographic</Button>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.state.activeCamera.type == "PerspectiveCamera" ? 'primary' : 'default'} onClick={() => this.changeActiveCamera("PerspectiveCamera")} fullWidth variant="outlined">Perspective</Button>
            </Grid>
          </Grid>
        </Paper>)}

        {this.state.ready && (
        <Paper className={classes.root}>
          <CameraCommons {...this.props} camera={this.state.activeCamera} />
          {this.state.activeCamera.type == "PerspectiveCamera"  && <PerspectiveCameraTools {...this.props}  camera={this.state.activeCamera} />}
          {this.state.activeCamera.type == "OrthographicCamera" && <OrthographicCameraTools {...this.props} camera={this.state.activeCamera} />}
        </Paper>)}
      </div>
    );
  }
}

export default withStyles(styles)(Camera);