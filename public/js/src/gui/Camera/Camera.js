import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

// import camera common components
import CameraViews from './common/CameraViews';
import CameraCommons from './common/CameraCommons';

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

    // console.log(this.props.active.object.type);

    return (
      <div className="subnavigation">
        <CameraViews {...this.props} />

        <Paper className={classes.root}>
          <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Camera Type</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.props.active.object.type == "OrthographicCamera" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("OrthographicCamera")} fullWidth variant="outlined">Orthographic</Button>
            </Grid>
            <Grid item xs={6}>
              <Button color={this.props.active.object.type == "PerspectiveCamera" ? 'primary' : 'default'} onClick={() => this.props.activateCamera("PerspectiveCamera")} fullWidth variant="outlined">Perspective</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.root}>
          <CameraCommons {...this.props} camera={this.props.active} />
          {this.props.active.object.type == "OrthographicCamera" && <PerspectiveCameraTools {...this.props} camera={this.props.active} />}
          {this.props.active.object.type == "PerspectiveCamera" && <OrthographicCameraTools {...this.props} camera={this.props.active} />}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Camera);