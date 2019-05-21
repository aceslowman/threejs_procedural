import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    textfield: {
        color:'green',
        margin:100
    }
});

class PerspectiveCameraTools extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps){
        if(this.props.camera != prevProps.camera){
            this.controls = (<Grid container spacing={8} justify="center">
                <Grid item xs={12}>
                    <Button variant="outlined" fullWidth={true}>Activate</Button>
                </Grid>

                <Divider />

                {/* NOTE: I am using CONTROLLED components */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="zoom-number"
                        label="zoom"
                        step="0.1"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        value={this.props.camera.zoom}
                        onChange={(e) => {
                            console.log(e.target.value);
                            this.props.updateCamera(this.props.camera.name, 'zoom', e.target.value);
                        }}
                    />
                    <Slider
                        id="zoom"
                        min={0}
                        max={10}
                        value={this.props.camera.zoom}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'zoom', v)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="fov-number"
                        label="fov"
                        step="5"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        value={this.props.camera ? this.props.camera.fov : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'fov', v)}
                    />
                    <Slider
                        id="fov"
                        min={0}
                        max={75}
                        value={this.props.camera ? this.props.camera.fov : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'fov', v)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        id="near"
                        label="near"
                        type="number"
                        variant="filled"
                        margin="dense"
                        step="0.1"
                        style={styles.textfield}
                        value={this.props.camera ? this.props.camera.near : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'near', v)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        id="far"
                        label="far"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        value={this.props.camera ? this.props.camera.far : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'far', v)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        id="filmGauge"
                        label="filmGauge"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        value={this.props.camera ? this.props.camera.filmGauge : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'filmGauge', v)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        id="filmOffset"
                        label="filmOffset"
                        type="number"
                        variant="filled"
                        margin="dense"
                        style={styles.textfield}
                        value={this.props.camera ? this.props.camera.filmOffset : 0}
                        onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'filmOffset', v)}
                    />
                </Grid>
            </Grid>);
        }
    }

    render() {
        return (
            <div>
                {this.controls}
            </div>
        );
    }
};

export default withStyles(styles)(PerspectiveCameraTools);