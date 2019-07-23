import React from 'react';
import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
  root: {
    padding: '16px !important',
    margin: '4px 4px 16px 4px',
    border: '1px solid rgba(255, 255, 255, 0.12);'
  },
  highlighted: {
    border: '1px solid rgba(255,255,255,0.6)'
  },
  type: {
    padding: '8px 0px'
  }
});

class ColorLookup extends React.Component{
  static defaultProps = {
    clear: false,
    enabled: true,
    renderToScreen: false,
    needsSwap: true,
    u: 0.5
  };

  constructor(props){
    super(props);
    
    this.state = {
      defines: {
        'SEED': props.seed
      },
      uniforms: {
        u: props.u
      },
      params: {
        enabled: props.enabled,
        renderToScreen: props.renderToScreen,
        needsSwap: props.needsSwap,
        clear: props.clear
      },
      name: "ColorLookup"
    }
  }

  componentDidMount(){
    this.shaderMaterial = new THREE.ShaderMaterial({
      defines: {
        'SEED': this.state.defines.SEED
      },
      uniforms: {
        u: { value: this.state.uniforms.u },
      },
      name: this.state.name
    });

    this.init();

    let shaderPass = new ShaderPass(this.shaderMaterial);

    shaderPass.clear = this.state.params.clear;
    shaderPass.needsSwap = this.state.params.needsSwap;
    shaderPass.enabled = this.state.params.enabled;
    shaderPass.renderToScreen = this.state.params.renderToScreen;

    this.props.addPass(shaderPass);
    this.props.composer.render(); // TEMP
  }

  /*
    call init() if the shader constants need to be reset.
  */
  init(){

    //------------------------------------------------------------------------------

    this.vert = `
      varying vec3 vPosition;

      void main()	{
          vPosition = position;
          gl_Position = vec4( position, 1.0 );
      }
      `;

    this.frag = `
      varying vec3 vPosition;

      uniform float u;

      void main() {
        gl_FragColor = vec4(u, 0.0, 1.0, 1.0);
      }
    `;

    this.shaderMaterial.vertexShader   = this.vert;
    this.shaderMaterial.fragmentShader = this.frag;
  }

  render() {
    const {classes} = this.props;

    return (
      <ExpansionPanel defaultExpanded={this.props.expanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>ColorLookup</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>

            
            
            {/* ENABLE */}
            <Grid item xs={12} align="right">
              <InputLabel margin="dense">Enabled</InputLabel>
              <Checkbox
                checked={this.state.params.enabled}
                onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.params.enabled = e.target.checked));
                    this.props.updatePassParam(this.props.index, "enabled", e.target.checked);
                  }
                }
              />
            </Grid>

            
            
            {/* RENDER TO SCREEN */}
            <Grid item xs={12} align="right">
              <InputLabel margin="dense">Render to Screen</InputLabel>
              <Checkbox
                checked={this.state.params.renderToScreen}
                onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.params.renderToScreen = e.target.checked));
                    this.props.updatePassParam(this.props.index, "renderToScreen", e.target.checked);
                  }
                }
              />
            </Grid>

            
            
            {/* OCTAVES */}
            {/* <Grid item xs={6}>
              <TextField
                label="Octaves"
                value={this.state.defines.NUM_OCTAVES}
                type="number"
                variant="filled"
                margin="dense"
                onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.defines.NUM_OCTAVES = e.target.value));
                    this.props.updatePassDefine(this.props.index, "NUM_OCTAVES", e.target.value);
                  }
                }
              />
            </Grid>
   */}
            
            {/* UNIFORM GROUP */}
            <Grid container alignItems="center">

              <Grid item xs={3} align="center">
                <InputLabel margin="dense">Uniform</InputLabel>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label="x"
                  value={this.state.uniforms.u}
                  inputProps={{ step: 0.01 }}
                  type="number"
                  variant="filled"
                  margin="dense"
                  onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.uniforms.u = e.target.value));
                    this.props.updatePassUniform(this.props.index, "u", e.target.value);
                  }
                }
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label="y"
                  value={this.state.uniforms.u}
                  inputProps={{ step: 0.01 }}
                  type="number"
                  variant="filled"
                  margin="dense"
                  onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.uniforms.u = e.target.value));
                    this.props.updatePassUniform(this.props.index, "u", e.target.value);
                  }
                }
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label="z"
                  value={this.state.uniforms.u}
                  inputProps={{ step: 0.01 }}
                  type="number"
                  variant="filled"
                  margin="dense"
                  onChange={(e) => {
                    e.persist();
                    this.setState(state => (state.uniforms.u = e.target.value));
                    this.props.updatePassUniform(this.props.index, "u", e.target.value);
                  }
                }
                />
              </Grid>
            </Grid>

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
};

export default withStyles(styles)(ColorLookup);
