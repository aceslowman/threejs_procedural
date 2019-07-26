import React from 'react';
import SketchContext from '../../SketchContext';

import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Stats from "stats-js";

import { RaytracingRenderer } from 'three/examples/jsm/renderers/RaytracingRenderer';

import Worker from '../../utilities/raytracing.worker.js';

const RAYTRACING_WORKERS = navigator.hardwareConcurrency || 3;

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class Renderer extends React.Component {
    static displayName = 'Renderer';
    static contextType = SketchContext;

    constructor(props, context){
        super(props, context);

        this.scene   = context.scene;
        this.physics = context.physics;
        this.clock   = context.clock;
    }

    componentDidMount(){
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.autoClear = false; // for insetScene!
        this.renderer.autoClearColor = false;

        this.renderer.setSize(this.props.width, this.props.height);

        this.insetCamera = new THREE.OrthographicCamera(
            this.props.width / -2,
            this.props.width / 2,
            this.props.height / 2,
            this.props.height / -2,
            0,
            1000
        );
        this.insetCamera.position.y = 1;

        this.props.onRef(this.renderer);

        this.setupStats();

        document.getElementById('APP').appendChild(this.renderer.domElement);

        this.start();
    }

    componentDidUpdate(prevProps){
        if(prevProps.width != this.props.width){
            this.renderer.setSize(this.props.width, this.props.height);
            this.insetCamera = new THREE.OrthographicCamera(
                this.props.width / -2,
                this.props.width / 2,
                this.props.height / 2,
                this.props.height / -2,
                0,
                1000
            );
            this.insetCamera.position.y = 1;
        }
    }

    changeRenderer(type){
        document.getElementById('APP').removeChild(this.renderer.domElement);

        switch(type){
            case 'NORMAL':
                // TODO: terminate workers

                this.renderer.clear();
                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.props.onRef(this.renderer);

                this.start();

                this.renderer.setSize(this.props.width, this.props.height);
                
                break;
            case 'RAYTRACING':            
                this.stop(); 

                this.renderer = new RaytracingRenderer({
                    workers: RAYTRACING_WORKERS,
                    worker: Worker,         // NOTE: to get around Worker/Webpack issues,
                    randomize: true,        // I am passing in the entire bundled worker, 
                    blockSize: 32           // instead of the workerPath. 
                });

                this.renderer.setClearColor(this.scene.background);
                this.renderer.setSize(this.props.width, this.props.height);
                this.props.onRef(this.renderer);

                // sending scene to renderer
                this.renderer.render(this.scene, this.props.camera);

                /* 
                    NOTE: don't use the standard BufferGeometry variants
                    when using RaytracingRenderer. The buffer attributes
                    will not be copied over unless it is an actual
                    BufferGeometry instance, not PlaneBufferGeometry or
                    similar.
                */

                break;        
        }

        document.getElementById('APP').appendChild(this.renderer.domElement);
    }

    setupStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.top = '';
        this.stats.domElement.style.display = 'visible';
        document.getElementById('APP').appendChild(this.stats.domElement);
    }

    start = () => {
        this.frameId = requestAnimationFrame(this.animate);
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    animate = () => {
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene = () => {
        let deltaTime = this.context.clock.getDelta();

        this.stats.begin();
        // if physics has been initialized, update it.
        if(this.context.physics) this.context.physics.update(deltaTime);
        // this.renderer.clear();
        this.renderer.render(this.scene, this.props.camera);

        /*

            WARNING: calling clear() on the renderer results in malfunctions 
            in the ProceduralMap, specifically the second pass of the elevation
            map.

        */
        // this.renderer.clearDepth(); // clear the depth buffer
        // console.log(this.context.overlayScene);
        this.renderer.render(this.context.overlayScene, this.insetCamera);
        this.stats.end();
    }

    render(){
        const { classes } = this.props;

        return (
            <Paper className={classes.root} style={{display: this.props.display ? 'block' : 'none'}}>
                <Grid
                    container
                    justify={'space-around'}
                    alignItems={'center'}
                    spacing={16}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Rendering</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                        onClick={() => this.changeRenderer("NORMAL")} 
                        fullWidth 
                        variant="outlined">
                            Normal
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                        onClick={() => this.changeRenderer("RAYTRACING")} 
                        fullWidth 
                        variant="outlined">
                            Raytracing
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(Renderer);