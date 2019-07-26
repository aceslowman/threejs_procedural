import React from 'react';
import SketchContext from '../../SketchContext';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import RootRef from '@material-ui/core/RootRef';

import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { Typography, Divider, InputLabel, Grid } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class ProceduralMap extends React.Component {
    static contextType = SketchContext;
    
    constructor(props, context){
        super(props);

        if(!props.children) console.error("no passes have been defined for map! make sure that valid passes have been provided as prop children.");

        this.passes   = props.children;
        this.renderer = context.renderer;
        this.scene    = context.scene;
        this.width    = props.width  || 256;
        this.height   = props.height || 256;
        this.seed     = props.seed || Math.random() * 10000;
        this.name     = props.name || "default map";

        this.mount = React.createRef();

        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,       // important for readPixels()
            type: THREE.FloatType,          // important for readPixels()
            stencilBuffer: false
        });

        this.composer = new EffectComposer(this.renderer, this.target);
        this.composer.setSize(this.width, this.height);        

        this.state = {
            displayMap: props.displayMap
        }
    }

    //------------------------------------------------------------------------
    componentDidMount(){
        this.composer.renderToScreen = false; /* required to render final pass */
        this.composer.swapBuffers();

        this.updateComposer();
        // this.generateDisplayCanvas(); //TODO
        if(this.state.displayMap) this.displayMapOnScreen();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.displayMap !== this.state.displayMap){
            this.state.displayMap ? this.displayMapOnScreen() : this.removeMapOnScreen();
        }
    }

    //------------------------------------------------------------------------
    generateDisplayCanvas() {
        this.displayCanvas = document.createElement('canvas');
        // this.displayCanvas.style.border = '1px solid pink';
        this.displayCanvas.style.padding = '15px';
        this.displayCanvas.width = this.mount.current.clientWidth;
        this.displayCanvas.height = this.mount.current.clientWidth;
        let ctx = this.displayCanvas.getContext('2d');

        let imgData = ctx.createImageData(this.width, this.height);
        let raw = this.getBufferArray();
        let data = new Uint8Array(raw.buffer);

        // console.log(raw)

        for(let i = 0; i < imgData.data.length; i++){
            if(i % 4 === 3) {
                imgData.data[i] = 255;
            }else{
                let v = raw.buffer[i] * 255;
                imgData.data[i] = v;
            };
        }

        console.log('raw', raw)
        console.log('data', data)
        console.log('imgdata', imgData.data);

        ctx.putImageData(imgData,0,0);

        this.mount.current.insertBefore(this.displayCanvas,this.mount.current.children[1]);
    }

    displayMapOnScreen(){
        if(!this.displayMesh){
            let mat = new THREE.MeshBasicMaterial({ map: this.target.texture })
            let geo = new THREE.PlaneBufferGeometry(this.width, this.height, 10, 10);
            this.displayMesh = new THREE.Mesh(geo, mat);
        }

        this.context.overlayScene.add(this.displayMesh);
    }

    removeMapOnScreen(){
        this.context.overlayScene.remove(this.displayMesh);
    }

    //------------------------------------------------------------------------
    addPass(pass) {
        this.composer.addPass(pass);
    }

    updateComposer(){
        this.composer.render();
        this.props.onRef(this.getBufferArray())
    }

    updatePassParam(pass_id, name, value) {
        this.composer.passes[pass_id][name] = value;
        this.updateComposer();
    }

    updatePassDefine(pass_id, name, value) {
        this.composer.passes[pass_id].material.defines[name] = value;
        this.composer.passes[pass_id].material.needsUpdate = true;
        this.updateComposer();
    }

    updatePassUniform(pass_id, name, value) {
        this.composer.passes[pass_id].uniforms[name].value = value;
        this.updateComposer();
    }

    //------------------------------------------------------------------------
    getSample(x, y) {
        const buffer = new Float32Array(4); // NOTE: can't use floats in Safari!
        if (x > this.width || y > this.height || x < 0 || y < 0) console.warn("sampling out of bounds")
        this.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
        return buffer[0];
    }

    getBufferArray() {
        const buffer = new Float32Array(this.width * this.height * 4); // NOTE: can't use floats in Safari!
        this.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
        return buffer;
    }

    //------------------------------------------------------------------------
    render() {
        const { classes } = this.props;

        return(
            <RootRef rootRef={this.mount}>
                <Paper className={classes.root}>
                    
                    <Grid container>
                        <Grid item xs={9}>
                            <Typography variant="h4" gutterBottom>
                                {this.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align="right">
                            <InputLabel margin="dense">Show</InputLabel>
                            <Checkbox
                                checked={this.state.displayMap}
                                onChange={(e) => {
                                    e.persist();
                                    this.setState({ displayMap: e.target.checked })
                                }}
                            />
                        </Grid>    
                    </Grid>
                    


                    <Divider />
                    {React.Children.map(this.passes, (child, i) => React.cloneElement(child, {
                        index: i,
                        updatePassParam: (p, n, v) => this.updatePassParam(p, n, v),     // pass the update props on to the
                        updatePassDefine: (p, n, v) => this.updatePassDefine(p, n, v),   // props.children
                        updatePassUniform: (p, n, v) => this.updatePassUniform(p, n, v),
                        addPass: (p) => this.addPass(p),
                        displayMapOnScreen: () => this.displayMapOnScreen(),
                        removeMapOnScreen: () => this.removeMapOnScreen(),
                        composer: this.composer,
                        seed: this.seed,
                        expanded: false
                    }))}
                </Paper>
            </RootRef>
        )
    }
};

export default withStyles(styles)(ProceduralMap);