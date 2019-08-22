import React from 'react';
import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteIcon from '@material-ui/icons/Delete';

// ui inputs
import VectorInput from './inputs/VectorInput';
import FloatInput from './inputs/FloatInput';
import BoolInput from './inputs/BoolInput';

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

class Gray2HSV extends React.Component {
    static defaultProps = {
        clear: false,
        enabled: true,
        renderToScreen: false,
        needsSwap: true,
        rot: 1.4,
        scale: [3,3,3]
    };

    constructor(props) {
        super(props);

        this.state = {
            defines: {
                'SEED': props.seed
            },
            uniforms: {
                rot: props.rot,
                scale: props.scale,
            },
            params: {
                enabled: props.enabled,
                renderToScreen: props.renderToScreen,
                needsSwap: props.needsSwap,
                clear: props.clear
            },
            name: "Gray2HSV"
        }
    }

    componentDidMount() {
        this.shaderMaterial = new THREE.ShaderMaterial({
            defines: {
                'SEED': this.state.defines.SEED
            },
            uniforms: {
                rot: { value: this.state.uniforms.rot },
                scale: { value: this.state.uniforms.scale },
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
    init() {

        //------------------------------------------------------------------------------

        this.vert = `
      varying vec2 vUv;

      void main()	{
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
      `;

        this.frag = `
      varying vec2 vUv;

      uniform float rot;
      uniform vec3 scale;

      uniform sampler2D tDiffuse;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec4 c = texture2D(tDiffuse, vUv);
        
        vec3 hsv = scale * c.rgb;

        gl_FragColor = vec4(hsv2rgb(hsv + vec3(rot,0.,0.)), 1.0);
      }
    `;

        this.shaderMaterial.vertexShader = this.vert;
        this.shaderMaterial.fragmentShader = this.frag;
    }

    render() {
        const { classes } = this.props;

        return (
            <ExpansionPanel defaultExpanded={this.props.expanded}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" className={classes.heading}>Gray2HSV</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>

                        <BoolInput
                            value={this.state.params.enabled}
                            name="Enable"
                            onChange={(param) => this.props.updatePassParam(this.props.index, "enabled", param)}
                        />

                        <BoolInput 
                            value={this.state.params.renderToScreen}
                            name="Render To Screen"
                            onChange={(param) => this.props.updatePassParam(this.props.index, "renderToScreen", param)}
                        />

                        <FloatInput 
                            value={this.state.uniforms.rot}
                            name="Rotation"
                            stepSize={0.1}
                            onChange={(uniform) => this.props.updatePassUniform(this.props.index, "rot", uniform)}
                        />

                        <VectorInput
                            size={3} 
                            value={this.state.uniforms.scale}
                            update={this.updatePassUniform}
                            name='Scale'
                            labels={['r','g','b']}
                            stepSize={0.1}
                            onChange={(uniform)=>this.props.updatePassUniform(this.props.index, "scale", uniform)}
                        />

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

export default withStyles(styles)(Gray2HSV);
