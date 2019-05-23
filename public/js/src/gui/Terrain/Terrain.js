import React from 'react';
import * as dg from "dis-gui";
import { withRouter, Route, Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/lab/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '4px 4px 16px 4px'
  }
});


class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  assembleElevationControls(){
    const {classes} = this.props;

    this.elev_controls = [];
    let m_k = 0;

    for (let m in this.props.maps) {
      let map = this.props.maps[m];

      let passes = [];
      for (let p in map.passes) {
        let pass = this.props.passes[map.passes[p]];
        let p_k = 0;

        // enabled
        let enabled = (
          <Grid item xs={5}>
            <InputLabel margin="dense">Enabled</InputLabel>
            <Checkbox
              key={p_k++}
              checked={pass.params.enabled}
              onChange={(val) => this.props.updatePassParam(map.passes[p], 'enabled', val)}
            />
          </Grid>
        );

        // render to screen
        let rendertoscreen = (
          <Grid item xs={7}>
            <InputLabel margin="dense">Render To Screen</InputLabel>
            <Checkbox
              key={p_k++}
              checked={pass.params.renderToScreen}
              onChange={(val) => this.props.updatePassParam(map.passes[p], 'renderToScreen', val)}
            />
          </Grid>
        );

        // defines
        let defines = [];
        for (let d in pass.defines) {
          let define = pass.defines[d];
          defines.push(
            <Grid item xs={6}>
              <TextField
                label={d}
                value={define}
                type="number"
                variant="filled"
                margin="dense"
                onChange={(val) => this.props.updatePassDefine(map.passes[p], d, val)}
              />
            </Grid>
          );
        }

        // uniforms
        let uniforms = [];
        for (let u in pass.uniforms) {
          let uniform = pass.uniforms[u];

          if (typeof uniform.value === 'number') {
            uniforms.push(
              <Grid item xs={6}>
                <TextField
                  key={p_k++}
                  label={u}
                  value={uniform.value}
                  type="number"
                  variant="filled"
                  margin="dense"
                  onChange={(val) => this.props.updatePassUniform(map.passes[p], u, val)}
                />
              </Grid>
            );
          } else if (typeof uniform.value === 'object') {
            uniforms.push(
              <Grid item xs={6}>
                <TextField
                  key={p_k++}
                  label={u}
                  value={uniform.value.name}
                  type="text"
                  variant="filled"
                  margin="dense"
                />
              </Grid>
            );
          }
        }

        passes.push(
          <Paper gutterTop className={classes.root}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom={true} gutterTop={true}>{map.passes[p]}</Typography>
                <Divider />
              </Grid>
              
              {enabled}
              {rendertoscreen}
              {defines}
              {uniforms}
            </Grid>
          </Paper>
        );
      }
      this.elev_controls.push(passes);

      m_k++;
    }
  }

  render() {
    this.assembleElevationControls();

    let location = this.props.location.pathname;

    return (
      <div className="subnavigation">
        <Paper
          elevation={0}
          square={true}
        >
          <Grid container xs={12} spacing={8}>
            {this.elev_controls}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));