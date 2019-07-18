import React from 'react';
import SketchContext from '../../SketchContext';

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
  static contextType = SketchContext;

  static defaultProps = {
    
  };

  constructor(props, context){
    super(props, context);

    this.scene    = context.scene;
    this.renderer = context.renderer;

    this.width    = props.width;
    this.height   = props.height;

    this.setupOrthographicCamera();
    this.setupPerspectiveCamera();
    this.setupFirstPersonCamera();

    this.state = {
      cameras: {
        ortho: this.ortho,
        perspective: this.persp,
        first_person: this.first_person
      },
      activeCamera: this.first_person
    }
  }

  componentDidMount(){
    this.props.onRef(this.state.activeCamera);
    this.setupOrbit();
    this.registerListeners();
  }

  componentDidUpdate(prevProps){
    // reset orbit controls after renderer change
    if (this.context.renderer != this.renderer) {
      this.setupOrbit();
    };
  }

  setupOrthographicCamera(){
    this.ortho = new THREE.OrthographicCamera(
      this.width / - 2,
      this.width / 2,
      this.height / 2,
      this.height / - 2,
      0,
      2000
    );

    this.ortho.name = "Default Orthographic";
    this.ortho.zoom = 2;
    this.ortho.position.y = 999;
    this.ortho.updateProjectionMatrix();
    this.ortho.updateMatrixWorld();
  }

  setupPerspectiveCamera() {
    this.persp = new THREE.PerspectiveCamera(
      75,                         // fov
      this.width / this.height,   // aspect
      0.01,                       // near
      2000                        // far
    );

    this.persp.name = "Default Perspective";
    this.persp.zoom = 2;
    this.persp.position.y = 999;
    this.persp.updateProjectionMatrix();
    this.persp.updateMatrixWorld();
  }

  setupFirstPersonCamera() {
    let pos = { x: 0, y: 100, z: 0 };
    let radius = 5;
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass =  15;

    //create mesh ----------------------------
    this.fpTransform = new THREE.Mesh(
      new THREE.SphereBufferGeometry(radius, 16, 16),
      new THREE.MeshNormalMaterial()
    );

    this.fpTransform.position.set(pos.x, pos.y, pos.z);
    this.fpTransform.castShadow = true;
    this.fpTransform.receiveShadow = true;

    this.context.scene.add(this.fpTransform);

    //create rigidbody ----------------------------
    let transform = new this.context.physics.Ammo.btTransform();
    transform.setIdentity();

    // set default position
    transform.setOrigin(new this.context.physics.Ammo.btVector3(pos.x, pos.y, pos.z));
    // set default rotation
    transform.setRotation(new this.context.physics.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new this.context.physics.Ammo.btDefaultMotionState(transform);
      console.log(motionState);
    let colShape = new this.context.physics.Ammo.btSphereShape(radius);
    colShape.setMargin(0.05);

    let localInertia = new this.context.physics.Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new this.context.physics.Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    this.fp_body = new this.context.physics.Ammo.btRigidBody(rbInfo);

    // lock axis to keep camera upright. TODO: make toggleable
    this.fp_body.setAngularFactor(this.context.physics.Ammo.btVector3(1,0,1));

    // this.fp_body.setCollisionFlags(2);
    this.fp_body.setActivationState(4);
    this.fp_body.setFriction(0);

    this.context.physics.physicsWorld.addRigidBody(this.fp_body);

    this.fpTransform.userData.physicsBody = this.fp_body;
    this.context.physics.bodies.push(this.fpTransform);

    //create camera ----------------------------
    this.first_person = new THREE.PerspectiveCamera(
      75,                         // fov
      this.width / this.height,   // aspect
      0.01,                       // near
      2000                        // far
    );


      console.log(this.fp_body);
    // this.first_person.rotateX(- Math.PI / 2);

    this.fpTransform.add(this.first_person);
    // this.moveFirstPersonCamera({code: "ArrowLeft"})
  }

  moveFirstPersonCamera(e){
    // e.preventDefault();
    let s = 1000;

    let body = this.fp_body;
    let motionState = body.getMotionState();

    /*
      OH MY GOD I WAS FORGETTING TO USE new FOR btVECTOR!
    */

    switch(e.code){
      case "ArrowLeft":
        body.applyForce(new this.context.physics.Ammo.btVector3(-s, 0, 0));
        break;
      case "ArrowRight":
        body.applyForce(new this.context.physics.Ammo.btVector3(s, 0, 0));
        break;
      case "ArrowUp":
        body.applyForce(new this.context.physics.Ammo.btVector3(0, 0, -s));
        break;
      case "ArrowDown":
        body.applyForce(new this.context.physics.Ammo.btVector3(0, 0, s));
        break;
    }
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

  changeActiveCamera(type){
    switch(type){
      case "OrthographicCamera": 
        this.setState({activeCamera: this.state.cameras.ortho});
        this.props.onRef(this.state.cameras.ortho);
        this.orbitControls.object = this.state.cameras.ortho;
        break;
      case "PerspectiveCamera":
        this.setState({activeCamera: this.state.cameras.perspective});
        this.props.onRef(this.state.cameras.perspective);
        this.orbitControls.object = this.state.cameras.perspective;
        break;
      case "FirstPerson":
        this.setState({activeCamera: this.first_person});
        this.props.onRef(this.first_person);
        break;
    }
  }

  update(){

  }

  //LISTENERS-----------------------------------------------------
  registerListeners() {
    window.addEventListener('resize', this.handleResize);

    /*
      FPC
    */
    document.addEventListener('keydown', (e) => this.moveFirstPersonCamera(e))
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
      <React.Fragment>
        <CameraViews camera={this.state.activeCamera} view="ANGLE" {...this.other} />

        <Paper className={classes.root}>
          <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Camera Type</Typography>
            </Grid>
            <Grid item xs={4}>
              <Button 
                color={this.state.activeCamera.type == "OrthographicCamera" ? 'primary' : 'default'} 
                onClick={() => this.changeActiveCamera("OrthographicCamera")} 
                fullWidth 
                variant="outlined"
              >
                Orthographic
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button 
                color={this.state.activeCamera.type == "PerspectiveCamera" ? 'primary' : 'default'} 
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
          <CameraCommons {...this.other} camera={this.state.activeCamera} />
          {this.state.activeCamera.type == "PerspectiveCamera" && 
            <PerspectiveCameraTools 
              {...this.other} 
              camera={this.state.activeCamera} 
            />
          }
          {this.state.activeCamera.type == "OrthographicCamera" && 
            <OrthographicCameraTools 
              {...this.other} 
              camera={this.state.activeCamera} 
            />
          }
        </Paper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Camera);