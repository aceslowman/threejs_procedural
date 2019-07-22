import React from 'react';
import * as THREE from 'three'; 
import SketchContext from '../../../SketchContext';

import CameraCommons from './common/CameraCommons'
import CameraViews from './common/CameraViews';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Divider from '@material-ui/core/Divider';
import { Typography, Paper } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class OrthographicCamera extends React.Component {
    static contextType = SketchContext;

    static defaultProps = {

    };
    
    constructor(props) {
        super(props);
        
        this.width = props.width;
        this.height = props.height;
    }

    componentDidMount(){
        this.camera = new THREE.OrthographicCamera(
            this.width / - 2,
            this.width / 2,
            this.height / 2,
            this.height / - 2,
            0,
            2000
        );

        this.camera.name = "Default Orthographic";
        this.camera.zoom = 2;
        this.camera.position.y = 999;
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();

        if(this.props.default) this.props.setActive(this.camera)
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
            </div>
        );
    }
};

export default withStyles(styles)(OrthographicCamera);