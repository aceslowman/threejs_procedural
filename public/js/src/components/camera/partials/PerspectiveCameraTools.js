import React from 'react';

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

        this.state = {
            focalLength: props.camera.getFocalLength()
        };
    }

    setFocalLength(v) {
        this.props.camera.setFocalLength(v);
        this.setState({focalLength: this.props.camera.getFocalLength()})
    }

    render() {
        const {classes} = this.props;

        return (
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="focal_length-number"
                    label="Focal Length"
                    type="number"
                    variant="filled"
                    margin="dense"
                    style={styles.textfield}
                    value={this.state.focalLength}
                    onChange={(e) => this.setFocalLength(e.target.value)}
                />
                <Slider
                    id="focal_length"
                    min={0}
                    max={75}
                    value={Number(this.state.focalLength)}
                    onChange={(e, v) => this.setFocalLength(v)}
                />
            </Grid>
        );
    }
};

export default withStyles(styles)(PerspectiveCameraTools);