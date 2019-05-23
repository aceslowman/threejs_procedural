import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '0 4px'
    }
});

class CameraViews extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;

        return (
            <Grid
                container
                justify={'space-between'}
                alignItems={'center'}
            >
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>Camera Views</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button disabled fullWidth variant="outlined">Side</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button disabled fullWidth variant="outlined">Top</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button disabled fullWidth variant="outlined">Angle</Button>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(CameraViews);