import React from 'react';
import * as dg from "dis-gui";
import { withRouter, Route, Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import FirstPersonIcon from '@material-ui/icons/PermIdentity';
import OrthoIcon from '@material-ui/icons/GridOn';
import PerspIcon from '@material-ui/icons/Visibility';


// import subgui
import FirstPersonCameraTools from './subgui/FirstPersonCameraTools.js';
import OrthographicCameraTools from './subgui/OrthographicCameraTools';
import PerspectiveCameraTools from './subgui/PerspectiveCameraTools';

class Camera extends React.Component {
  constructor(props){
    super(props);

    this.state = {}
  }

  render(){
    let location = this.props.location.pathname;

    return (
      <div className="subnavigation">
        <Grid className="subnav" container spacing={this.state.open ? 0 : 0} alignItems="center" justify="center">
          <Grid item>
            <Button color={location == '/camera/firstperson/' ? 'primary' : 'default'} component={Link} to="/camera/firstperson/" disableRipple={true} fullWidth={true} onClick={() => this.handleDrawerOpen()}>First Person</Button>
          </Grid>
          <Grid item>
            <Button color={location == '/camera/ortho/' ? 'primary' : 'default'} component={Link} to="/camera/ortho/" fullWidth={true}>Orthographic</Button>
          </Grid>
          <Grid item>
            <Button color={location == '/camera/perspective/' ? 'primary' : 'default'} component={Link} to="/camera/perspective/" fullWidth={true}>Perspective</Button>
          </Grid>
        </Grid>
        <Divider />
        <Paper
          elevation={0}  
          square={true}
        >
          <Route path="/camera/" exact render={(props)=><PerspectiveCameraTools {...props} camera={this.props.cameras["Perspective"]} activateCamera={(cam)=>this.props.activateCamera(cam)} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/> 
          <Route path="/camera/firstperson/" render={(props)=><FirstPersonCameraTools {...props} camera={this.props.cameras["First Person"]} activateCamera={(cam)=>this.props.activateCamera(cam)} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
          <Route path="/camera/ortho/" render={(props)=><OrthographicCameraTools {...props} camera={this.props.cameras["Orthographic"]} activateCamera={(cam)=>this.props.activateCamera(cam)} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
          <Route path="/camera/perspective/" render={(props)=><PerspectiveCameraTools {...props} camera={this.props.cameras["Perspective"]} activateCamera={(cam)=>this.props.activateCamera(cam)} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
        </Paper>
      </div>
    );
  }
}

export default withRouter(Camera);