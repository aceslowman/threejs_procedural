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
import { Typography, ExpansionPanelActions } from '@material-ui/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteIcon from '@material-ui/icons/Delete';

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
                onChange={(e) => this.props.updatePassDefine(map.passes[p], d, e.target.value)}
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
                  onChange={(e) => this.props.updatePassUniform(map.passes[p], u, e.target.value)}
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
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" className={classes.heading}>{map.passes[p]}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                {enabled}
                {rendertoscreen}
                {defines}
                {uniforms}
              </Grid>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <IconButton disabled size="small"><DeleteIcon /></IconButton>
              <IconButton disabled size="small"><UpIcon /></IconButton>
              <IconButton disabled size="small"><DownIcon /></IconButton>
            </ExpansionPanelActions>
          </ExpansionPanel>
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
        <Grid container xs={12} spacing={8}>
          {this.elev_controls}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));

/*
  assembleMeshControls() {
    this.mesh_controls = [];
    let p_k = 0;

    for (let p in this.props.terrain) {
      let param = this.props.terrain[p];

      if (typeof param === 'number') {
        this.mesh_controls.push(
          <dg.Number
            key={p_k++}
            label={p}
            value={param}
            step={0.01}
            onChange={(val) => this.props.updateTerrain(p, val)}
          />
        );
      } else if (typeof param === 'string') {
        this.mesh_controls.push(
          <dg.Text
            key={p_k++}
            label={p}
            value={param}
          />
        );
      } else {
        console.warn('terrain parameter not mapped to GUI');
      }
    }
  }
*/