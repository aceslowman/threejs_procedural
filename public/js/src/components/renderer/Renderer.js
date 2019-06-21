import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import * as THREE from 'three';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { RaytracingRenderer } from '../../utilities/Raytracing/RaytracingRenderer';

const RAYTRACING_WORKERS = navigator.hardwareConcurrency || 3;

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class Renderer extends React.Component {
    constructor(props){
        super(props);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.renderer.setSize(props.width, props.height);

        props.setRenderer(this.renderer);
    }

    componentDidMount(){
        this.renderer.setSize(this.props.width, this.props.height);
        document.getElementById('APP').appendChild(this.renderer.domElement);
    }

    componentDidUpdate(prevProps){
        if(prevProps.width != this.props.width){
            this.renderer.setSize(this.props.width, this.props.height);
        }
    }

    changeRenderer(type){
        document.getElementById('APP').removeChild(this.renderer.domElement);

        switch(type){
            case 'NORMAL':
                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                break;
            case 'RAYTRACING':
                this.renderer = new THREE.RaytracingRenderer({
                    workers: RAYTRACING_WORKERS,
                    workerPath: '../utilities/raytracing.worker.js',
                    randomize: true,
                    blockSize: 64
                })
                break;        
        }

        this.renderer.setSize(this.props.width, this.props.height);

        // mount?
        document.getElementById('APP').appendChild(this.renderer.domElement);

        this.props.setRenderer(this.renderer);
    }

    render(){
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper className={classes.root}>
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
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Renderer);