import React from 'react';
import CameraCommons from '../common/CameraCommons'

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
        margin: '0 4px'
    }
});

class FirstPersonCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Paper className={classes.root}>
                    <CameraCommons camera={this.props.camera} activateCamera={this.props.activateCamera} updateCamera={this.props.updateCamera} />
                </Paper>
            </div>
        );
    }
};

export default withStyles(styles)(FirstPersonCameraTools);