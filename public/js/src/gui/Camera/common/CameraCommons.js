import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({

});

class CameraCommons extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
                <Grid container spacing={8} justify="center">
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth={true} onClick={()=>this.props.activateCamera(this.props.camera.name)}>Activate</Button>
                    </Grid>

                    <Divider />

                    <Grid item xs={6}>
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
                            onChange={(e) => this.props.updateCamera(this.props.camera.name, 'zoom', e.target.value)}
                        />
                        <Slider
                            id="zoom"
                            min={0}
                            max={10}
                            value={Number(this.props.camera.zoom)}
                            onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'zoom', v)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="focal_length-number"
                            label="Focal Length"
                            step="5"
                            type="number"
                            variant="filled"
                            margin="dense"
                            style={styles.textfield}
                            value={this.props.camera.focalLength}
                            onChange={(e) => this.props.updateCamera(this.props.camera.name, 'focalLength', e.target.value)}
                        />
                        <Slider
                            id="focal_length"
                            min={0}
                            max={75}
                            value={Number(this.props.camera.focalLength)}
                            onChange={(e, v) => this.props.updateCamera(this.props.camera.name, 'focalLength', v)}
                        />
                    </Grid>
                </Grid>
        );
    }        
}

export default withStyles(styles)(CameraCommons);