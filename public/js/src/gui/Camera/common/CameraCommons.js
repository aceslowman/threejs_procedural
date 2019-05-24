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
            <div>
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
            </div>
        );
    }        
}

export default withStyles(styles)(CameraCommons);