import React from 'react';
import * as dg from "dis-gui";
import { Route, Link } from 'react-router-dom';

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

export default class Camera extends React.Component {
  constructor(props){
    super(props);

    this.state = {}
  }

  render(){
    return (
      <div className="subnavigation">
        <Grid className="subnav" container spacing={this.state.open ? 0 : 0} alignItems="center" justify="center">
          <Grid item>
            <Button component={Link} to="/camera/firstperson/" disableRipple={true} fullWidth={true} onClick={() => this.handleDrawerOpen()}><FirstPersonIcon style={{fontSize: 18}}/></Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/camera/ortho/" fullWidth={true}><OrthoIcon style={{fontSize: 18}}/></Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/camera/perspective/" fullWidth={true}><PerspIcon style={{fontSize: 18}}/></Button>
          </Grid>
        </Grid>
        <Divider />
        <Paper
          style={{padding:16}}
          elevation={0}  
          square={true}
        >
          <Route path="/camera/" exact render={(props)=><PerspectiveCameraTools {...props} camera={this.props.cameras["Perspective"]} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/> 
          <Route path="/camera/firstperson/" exact render={(props)=><FirstPersonCameraTools {...props} camera={this.props.cameras["First Person"]} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
          <Route path="/camera/ortho/" exact render={(props)=><OrthographicCameraTools {...props} camera={this.props.cameras["Orthographic"]} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
          <Route path="/camera/perspective/" exact render={(props)=><PerspectiveCameraTools {...props} camera={this.props.cameras["Perspective"]} updateCamera={(camId, param, val)=>this.props.updateCamera(camId, param, val)} />}/>
        </Paper>
      </div>
    );
  }
}
