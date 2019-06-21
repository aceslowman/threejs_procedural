import React from 'react';
import { withRouter, Route} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import ProceduralMap from '../map/ProceduralMap';

import FractalNoise from "../../shaders/FractalNoise.js";
import FractalWarp from "../../shaders/FractalWarp.js";

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const styles = theme => ({
  root: {
    padding: 8,
    margin: '4px 4px 16px 4px'
  }
});

class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.renderer  = props.renderer;
    this.scene     = props.scene;
    this.width     = props.width;
    this.height    = props.height;
    this.detail    = props.detail;
    this.amplitude = props.amplitude;
    this.seed      = Math.random() * 10000;

    this.verbose   = false;

    this.geometry  = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      this.detail,
      this.detail
    );

    this.state = {
      ready: false,
      detail: props.detail,
      width: props.width,
      height: props.height
    }
  }

  updateMesh(name, v) {
    this.setState({[name]: v});

    this.scene.remove(this.mesh)

    this.geometry = new THREE.PlaneBufferGeometry(
      this.state.width,
      this.state.height,
      v,
      v    
    );

    this.initializeMesh();
    this.displaceGeometry();
  }

  componentDidMount() {
    this.initializeMesh();
    this.setupDebug();
    this.ready();
  }

  ready() {
    this.setState({ ready: true });
    this.props.terrainReady(this);
  }

  initializeMesh() {
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupDebug() {
    var helper = new THREE.Box3Helper(this.geometry.boundingBox, 0xffff00);
    this.scene.add(helper);
  }

  displaceGeometry() {
    const displacement_buffer = this.elevation.getBufferArray();
    const positions = this.geometry.getAttribute('position').array;
    const uvs = this.geometry.getAttribute('uv').array;
    const count = this.geometry.getAttribute('position').count;
    
    for (let i = 0; i < count; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const x = Math.floor(u * (this.width - 1.0));
      const y = Math.floor(v * (this.height - 1.0));
      const d_index = (y * this.height + x) * 4;
      let r = displacement_buffer[d_index];

      positions[i * 3 + 2] = (r * this.amplitude);
    }

    this.geometry.getAttribute('position').needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();

    this.geometry.translate(0, 0, -this.geometry.boundingBox.min.z);
  }

  globalBoundsCheck(a) {
    let h_w = (this.width / 2);
    let h_h = (this.height / 2);

    if (a.x >= h_w || a.x <= -h_w || a.y >= h_h || a.y <= -h_h) {
      if (this.verbose) console.warn('endpoint was out of bounds', a);
      return false;
    }

    return true;
  }

  render() {
    const {classes} = this.props;
    
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Grid container justify={'center'} alignItems={'center'} alignContent='center' spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">Mesh Settings</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="detail-helper">detail</InputLabel>
                <Select
                  value={this.state.detail}
                  onChange={(e)=>this.updateMesh("detail", e.target.value)}
                >
                  <MenuItem value={64}> 
                    <em>64</em>
                  </MenuItem>
                  <MenuItem value={128}>128</MenuItem>
                  <MenuItem value={256}>256</MenuItem>
                  <MenuItem value={512}>512</MenuItem>
                </Select>
                <FormHelperText>resolution of mesh</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <ProceduralMap
          name="Elevation"
          renderer={this.renderer}
          width={this.width}
          height={this.height}
          displaceGeometry={() => this.displaceGeometry()}
          seed={this.seed}
          onRef={ref => {
            this.elevation = ref;
            console.log(ref);
          }}
        >
          <FractalNoise />
          {/* <FractalWarp /> */}
        </ProceduralMap>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Terrain);