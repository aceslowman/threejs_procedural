import React from 'react';
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

class OrthoGraphicCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
            </div>
        );
    }
};

export default withStyles(styles)(OrthoGraphicCameraTools);