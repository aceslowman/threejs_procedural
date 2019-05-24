import React from 'react';
import * as dg from "dis-gui";
import { withRouter, Route, Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';


import FirstPersonIcon from '@material-ui/icons/PermIdentity';
import OrthoIcon from '@material-ui/icons/GridOn';
import PerspIcon from '@material-ui/icons/Visibility';

import CameraViews from './common/CameraViews';

// import subgui
import OrthographicCameraTools from './subgui/OrthographicCameraTools';
import PerspectiveCameraTools from './subgui/PerspectiveCameraTools';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '8px 4px'
  }
});

class Camera extends React.Component {
  constructor(props){
    super(props);

    this.state = {}
  }

  render(){
    const { classes } = this.props;

    let location = this.props.location.pathname;

    return (
      <div className="subnavigation">
        <CameraViews {...this.props} />

        <Paper className={classes.root}>
      
          <Grid
            container
            justify={'space-around'}
            alignItems={'center'}
            spacing={16}
          >
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Camera Type</Typography>
            </Grid>
            {/* <Grid item xs={4}>
              <Button onClick={() => this.props.activateCamera("First Person")} fullWidth>First</Button>
            </Grid> */}
            <Grid item xs={4}>
              <Button color={this.props.active == "Orthographic" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("Orthographic")} fullWidth>Orthographic</Button>
            </Grid>
            <Grid item xs={4}>
              <Button color={this.props.active == "Perspective" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("Perspective")} fullWidth>Perspective</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={0}  
          square={true}
        >
          {this.props.active == "Perspective" && <PerspectiveCameraTools {...this.props} camera={this.props.cameras["Perspective"]} />}
          {this.props.active == "Orthographic" && <OrthographicCameraTools {...this.props} camera={this.props.cameras["Orthographic"]} />}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Camera));