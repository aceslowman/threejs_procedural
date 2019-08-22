import React from 'react';
import * as THREE from 'three';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';

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

class InputShader extends React.Component {
    static defaultProps = {
        clear: false,
        enabled: true,
        renderToScreen: false,
        needsSwap: true,
        input: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            uniforms: {
                tDiffuse: props.input
            },
            params: {
                enabled: props.enabled,
                renderToScreen: props.renderToScreen,
                needsSwap: props.needsSwap,
                clear: props.clear
            },
            name: "InputShader"
        }
    }

    componentDidMount() {
        // this.shaderMaterial = new THREE.ShaderMaterial({
        //     uniforms: {
        //         tDiffuse: { value: this.state.uniforms.tDiffuse },
        //     },
        //     name: this.state.name
        // });

        // this.shaderMaterial = new TexturePass(this.props.input, 1.0);

        // this.init();

        // console.log(JSON.stringify(this.shaderMaterial.uniforms.tDiffuse));

        this.shaderPass = new TexturePass(this.props.input, 1.0);

        this.shaderPass.clear = this.state.params.clear;
        this.shaderPass.needsSwap = this.state.params.needsSwap;
        this.shaderPass.enabled = this.state.params.enabled;
        this.shaderPass.renderToScreen = this.state.params.renderToScreen;

        this.props.addPass(this.shaderPass);
    }

    componentDidUpdate(prevProps){
        console.log('updating!');

        // if(this.props.input != prevProps.input){
        this.shaderPass.uniforms.tDiffuse = this.props.input;
        this.props.updateMap();
        // }

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

      uniform sampler2D tDiffuse;

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);

        gl_FragColor = vec4(color.r,0.0,0.5,1.0);
        // gl_FragColor = color;
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
                    <Typography variant="h5" className={classes.heading}>InputShader</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <Grid item xs={12}>
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

export default withStyles(styles)(InputShader);
