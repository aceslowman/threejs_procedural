import React from 'react';
import SketchContext from '../../SketchContext';

import * as THREE from 'three';
import OrbitControls from "../../utilities/OrbitControls.js";

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { Divider } from '@material-ui/core'; 

// import camera common components
import CameraViews from './partials/common/CameraViews';
import CameraCommons from './partials/common/CameraCommons';

// import subgui
import OrthographicCamera from './partials/OrthographicCamera';
import PerspectiveCamera from './partials/PerspectiveCamera';
import FirstPersonCamera from './partials/FirstPersonCamera';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '8px 4px'
  }
});

class Camera extends React.Component {
  static contextType = SketchContext;

  static defaultProps = {
    
  };

  constructor(props, context){
    super(props, context);

    this.scene    = context.scene;
    this.renderer = context.renderer;

    this.width    = props.width;
    this.height   = props.height;

    this.state = {
      activeCamera: this.first_person
    }
  }

  componentDidMount(){
    // this.props.onRef(this.state.activeCamera);
    // this.setupOrbit();
    this.registerListeners();
  }

  componentDidUpdate(prevProps){
    // reset orbit controls after renderer change
    if (this.context.renderer != this.renderer) {
      this.setupOrbit();
    };
  }

  setupOrbit() {
    this.orbitControls = new OrbitControls(
      this.persp,
      this.renderer.domElement
    );

    this.orbitControls.dampingFactor = 0.8;
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 1000;
    // this.orbitControls.maxPolarAngle = Math.PI / 2;
  }

  changeActiveCamera(camera){
    console.log(camera);
    this.setState({activeCamera: camera});
    this.props.onRef(camera);
    // this.orbitControls.object = camera;
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
    
    const { classes, ...other } = this.props; // seperate classes out so that
                                              // they aren't sent to children

    return (
        <Paper className={classes.root} style={{display: this.props.display ? 'block' : 'none'}}>
          <Grid
            container
            justify={'space-around'}
            alignItems={'center'}
            spacing={16}
          >
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>Camera</Typography>
              <Divider />
            </Grid>
          <CameraViews camera={this.state.activeCamera} view="ANGLE" {...this.other} />

          <Paper className={classes.root}>
            <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
              <Grid item xs={12}>
                <Typography variant="h6" align="center">Camera Type</Typography>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  // color={this.state.activeCamera.type == "OrthographicCamera" ? 'primary' : 'default'} 
                  onClick={() => this.changeActiveCamera("OrthographicCamera")} 
                  fullWidth 
                  variant="outlined"
                >
                  Orthographic
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  // color={this.state.activeCamera.type == "PerspectiveCamera" ? 'primary' : 'default'} 
                  onClick={() => this.changeActiveCamera("PerspectiveCamera")} 
                  fullWidth 
                  variant="outlined"
                >
                  Perspective
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  // color={this.state.activeCamera.type == "PerspectiveCamera" ? 'primary' : 'default'}
                  onClick={() => this.changeActiveCamera("FirstPerson")}
                  fullWidth
                  variant="outlined"
                >
                  First Person
                </Button>
              </Grid>            
            </Grid>
          </Paper>

          <Paper className={classes.root}>
            <FirstPersonCamera 
              default
              width={this.width}
              height={this.height}
              active={this.state.activeCamera && this.state.activeCamera.name == "FirstPersonCamera"}
              setActive={(r)=>this.changeActiveCamera(r)}
            />
            {/* <PerspectiveCamera 
              active={this.state.activeCamera && this.state.activeCamera.name == "PerspectiveCamera"}
              setActive={(r)=>this.changeActiveCamera(r)}
            />
            <OrthographicCamera 
              active={this.state.activeCamera && this.state.activeCamera.name == "OrthographicCamera"}
              setActive={(r)=>this.changeActiveCamera(r)}
            /> */}
          </Paper>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(Camera);