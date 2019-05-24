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

class MeshTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div className="">
                <Grid container xs={12} spacing={8}>
                    MESH TOOLS
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(withRouter(MeshTools));

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