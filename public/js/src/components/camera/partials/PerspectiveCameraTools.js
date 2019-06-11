import React from 'react';
import CameraCommons from './common/CameraCommons';
import CameraViews from './common/CameraViews';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Divider from '@material-ui/core/Divider';
import { Typography, Paper } from '@material-ui/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class PerspectiveCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="focal_length-number"
                        label="Focal Length"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        // value={this.props.camera.focalLength}
                        onChange={(e) => this.props.updateCamera(this.props.camera.name, 'focalLength', e.target.value)}
                    />
                    <Slider
                        id="focal_length"
                        min={0}
                        max={75}
                        // value={Number(this.props.camera.focalLength)}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'focalLength', v)}
                    />
                </Grid>
            </React.Fragment>
        );
    }
};

export default withStyles(styles)(PerspectiveCameraTools);