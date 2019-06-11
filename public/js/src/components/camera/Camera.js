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
    this.width = props.width;
    this.height = props.height;

    this.initialize();

    this.state = { ready: false, activeCamera: '' }
  }

  initialize() {
    let ortho = new THREE.OrthographicCamera(
      this.width / - 2,
      this.width / 2,
      this.height / 2,
      this.height / - 2,
      0,
      2000
    );

    ortho.name = "Default Orthographic";
    ortho.zoom = 2;
    ortho.position.z = 999;
    ortho.up.set(0, 0, 1);
    ortho.updateProjectionMatrix();
    ortho.updateMatrixWorld();

    let perspective = new THREE.PerspectiveCamera(
      75,                         // fov
      this.width / this.height,   // aspect
      0.01,                       // near
      2000                        // far
    );

    perspective.name = "Default Perspective";
    perspective.zoom = 2;
    perspective.position.z = 999;
    perspective.up.set(0, 0, 1);
    perspective.updateProjectionMatrix();
    perspective.updateMatrixWorld();

    this.camera = perspective;

    this.setupOrbit();

    this.setState({activeCamera: this.camera})

    // this.props.addCamera(ortho);
    // this.props.addCamera(perspective);
    // this.props.setActiveCamera(perspective.uuid);

    // this.props.changeView('ANGLE');
  }

  componentDidUpdate(prevProps) {
    if(this.props.cameras != prevProps.cameras){
      let cam = this.props.cameras.byId[this.props.cameras.active];
      
      // NOTE NOTE NOTE
      /*
        I am going to try to make this work without any redux. the gui
        and the webgl are in the same place now anyways...
      */

      /* There could be a performance boost here by only copying over the 
        parameters that have changed. Not sure how that works but maybe it's 
        a matter of doing some kind of diff. I am imagining that 
        loader.parse() could be a bottleneck. */

      // const loader = new THREE.ObjectLoader();
      // const obj = loader.parse(cam);

      // this.camera = obj;
      // this.camera.updateProjectionMatrix();

      // this.camera.up.set(0, 0, 1);

      // this.orbitControls.object = this.camera;
      // this.orbitControls.update();

      // this.props.cameraUpdate(this.camera)
    }
  }

  componentDidMount(){
    this.ready();
  }

  ready(){
    this.setState({ready: true, activeCamera: this.camera});
    this.props.cameraReady(this.camera);
  }

  setupOrbit() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls.dampingFactor = 0.8;
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 1000;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    this.props.addOrbit(this.orbitControls);
  }

  cameraUpdate(obj){
    for (let key in obj) {
      this.camera[key] = obj[key];

      if (key == 'zoom') this.camera.updateProjectionMatrix();
    }
  }

  getCamera() {
    return this.camera;
  }

  render(){
    const { classes } = this.props;

    return (
      <div className="subnavigation">
        {this.state.ready && (<CameraViews {...this.props} />)}

        {this.state.ready && (
        <Paper className={classes.root}>
          <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Camera Type</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.state.activeCamera.type == "OrthographicCamera" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("OrthographicCamera")} fullWidth variant="outlined">Orthographic</Button>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.state.activeCamera.type == "PerspectiveCamera" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("PerspectiveCamera")} fullWidth variant="outlined">Perspective</Button>
            </Grid>
          </Grid>
        </Paper>)}

        {this.state.ready && (
        <Paper className={classes.root}>
          <CameraCommons {...this.props} camera={this.state.activeCamera} />
          {this.state.activeCamera.type == "PerspectiveCamera" && <PerspectiveCameraTools {...this.props} camera={this.state.activeCamera} />}
          {this.state.activeCamera.type == "OrthographicCamera" && <OrthographicCameraTools {...this.props} camera={this.state.activeCamera} />}
        </Paper>)}
      </div>
    );
  }
}

export default withStyles(styles)(Camera);