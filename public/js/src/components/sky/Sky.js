import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SketchContext from "../../SketchContext";
import { Divider } from '@material-ui/core'; 
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';


import * as THREE from 'three';

import { Sky as Skybox } from 'three/examples/jsm/objects/Sky';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class Sky extends React.Component {
    static contextType = SketchContext;

    constructor(props, context) {
        super(props, context);

        this.scene = context.scene;

        this.state = {
            turbidity: 10,
            rayleigh: 2,
            luminance: 1,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            inclination: 0.49,
            azimuth: 0.25
        };
    }

    componentDidMount(){
        this.distance = 400000;
        let sky = new Skybox();
        sky.scale.setScalar(450000);
        sky.updateMatrixWorld();

        this.uniforms = sky.material.uniforms;
        this.uniforms["turbidity"].value = this.state.turbidity;
        this.uniforms["rayleigh"].value = this.state.rayleigh;
        this.uniforms["luminance"].value = this.state.luminance;
        this.uniforms["mieCoefficient"].value = this.state.mieCoefficient;
        this.uniforms["mieDirectionalG"].value = this.state.mieDirectionalG;

        this.context.scene.add(sky);

        this.initSun();        
    }

    componentDidUpdate(){
        this.updateSun();
    }

    initSun(){
        this.sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );
        this.sunSphere.position.x = -700000;
        this.sunSphere.updateWorldMatrix();

        var theta = Math.PI * (this.state.inclination - 0.5);
        var phi = 2 * Math.PI * (this.state.azimuth - 0.5);
        this.sunSphere.position.x = this.distance * Math.cos(phi);
        this.sunSphere.position.y = this.distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = this.distance * Math.sin(phi) * Math.cos(theta);
        this.sunSphere.visible = true;
        this.uniforms["sunPosition"].value.copy(this.sunSphere.position);

        this.context.scene.add(this.sunSphere);

        // var intensity = 70000; // raytracer apparently needs HIGH intensity
        let intensity = 1.0;

        this.sunlight = new THREE.PointLight(0xffaa55, intensity);
        this.sunlight.position.copy(this.sunSphere.position);
        this.sunlight.physicalAttenuation = true;
        this.context.scene.add(this.sunlight);
    }

    setParam(id, value){
        if(!this.state[id]) console.error(`${id} does not exist in state`);

        this.setState({ [id]: value });

        if(this.uniforms[id]) this.uniforms[id].value = value;
    }

    updateSun(){
        var theta = Math.PI * (this.state.inclination - 0.5);
        var phi = 2 * Math.PI * (this.state.azimuth - 0.5);
        this.sunSphere.position.x = this.distance * Math.cos(phi);
        this.sunSphere.position.y = this.distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = this.distance * Math.sin(phi) * Math.cos(theta);
        this.sunSphere.visible = true;
        this.uniforms["sunPosition"].value.copy(this.sunSphere.position);

        this.sunlight.position.copy(this.sunSphere.position);
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid
                    container
                    justify={'space-around'}
                    alignItems={'center'}
                    spacing={16}
                >
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Sky</Typography>
                        <Divider />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="turbidity-number"
                            label="turbidity"
                            step="0.1"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.turbidity}
                            onChange={(e) => this.setParam('turbidity', e.target.value)}
                        />
                        <Slider
                            id="turbidity"
                            min={0}
                            max={10}
                            value={Number(this.state.turbidity)}
                            onChange={(e, v) => this.setParam('turbidity', v)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="rayleigh-number"
                            label="rayleigh"
                            step="0.1"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.rayleigh}
                            onChange={(e) => this.setParam('rayleigh', e.target.value)}
                        />
                        <Slider
                            id="rayleigh"
                            min={0}
                            max={10}
                            value={Number(this.state.rayleigh)}
                            onChange={(e, v) => this.setParam('rayleigh', v)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="luminance-number"
                            label="luminance"
                            step="0.1"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.luminance}
                            onChange={(e) => this.setParam('luminance', e.target.value)}
                        />
                        <Slider
                            id="luminance"
                            min={0}
                            max={10}
                            value={Number(this.state.luminance)}
                            onChange={(e, v) => this.setParam('luminance', v)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="mieCoefficient-number"
                            label="mieCoefficient"
                            step="0.1"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.mieCoefficient}
                            onChange={(e) => this.setParam('mieCoefficient', e.target.value)}
                        />
                        <Slider
                            id="mieCoefficient"
                            min={0}
                            max={10}
                            value={Number(this.state.mieCoefficient)}
                            onChange={(e, v) => this.setParam('mieCoefficient', v)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="mieDirectionalG-number"
                            label="mieDirectionalG"
                            step="0.1"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.mieDirectionalG}
                            onChange={(e) => this.setParam('mieDirectionalG', e.target.value)}
                        />
                        <Slider
                            id="mieDirectionalG"
                            min={0}
                            max={10}
                            value={Number(this.state.mieDirectionalG)}
                            onChange={(e, v) => this.setParam('mieDirectionalG', v)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="inclination-number"
                            label="inclination"
                            step="0.05"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.inclination}
                            onChange={(e) => this.setParam('inclination', e.target.value)}
                        />
                        <Slider
                            id="inclination"
                            min={-1}
                            max={1}
                            value={Number(this.state.inclination)}
                            onChange={(e, v) => this.setParam('inclination', v)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="azimuth-number"
                            label="azimuth"
                            step="0.05"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.state.azimuth}
                            onChange={(e) => this.setParam('azimuth', e.target.value)}
                        />
                        <Slider
                            id="azimuth"
                            min={-1}
                            max={1}
                            value={Number(this.state.azimuth)}
                            onChange={(e, v) => this.setParam('azimuth', v)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(Sky);