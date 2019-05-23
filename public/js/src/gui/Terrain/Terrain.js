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

import FirstPersonIcon from '@material-ui/icons/PermIdentity';
import OrthoIcon from '@material-ui/icons/GridOn';
import PerspIcon from '@material-ui/icons/Visibility';

class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  assembleElevationControls(){
    this.elev_controls = [];
    let m_k = 0;

    for (let m in this.props.maps) {
      let map = this.props.maps[m];

      for (let p in map.passes) {
        let pass = this.props.passes[map.passes[p]];

        let pass_controls = [];
        let p_k = 0;

        // enabled
        pass_controls.push(
          <Grid item xs={6}>
            <Checkbox
              key={p_k++}
              checked={pass.params.enabled}
              onChange={(val) => this.props.updatePassParam(map.passes[p], 'enabled', val)}
            />
          </Grid>
        );

        // render to screen
        pass_controls.push(
          <Grid item xs={6}>
            <Checkbox
              key={p_k++}
              checked={pass.params.renderToScreen}
              onChange={(val) => this.props.updatePassParam(map.passes[p], 'renderToScreen', val)}
            />
          </Grid>
        );

        for (let d in pass.defines) {
          let define = pass.defines[d];
          pass_controls.push(
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

        for (let u in pass.uniforms) {
          let uniform = pass.uniforms[u];

          if (typeof uniform.value === 'number') {
            pass_controls.push(
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
            // pass_controls.push(
            //   <dg.Text
            //     key={p_k++}
            //     label={u}
            //     value={uniform.value.name}
            //   />
            // );
          }
        }

        this.elev_controls.push(pass_controls);

        m_k++;
      }
    }
  }

  render() {
    this.assembleElevationControls();

    let location = this.props.location.pathname;

    return (
      <div className="subnavigation">
        <Paper
          style={{ padding: 16 }}
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

export default withRouter(Terrain);