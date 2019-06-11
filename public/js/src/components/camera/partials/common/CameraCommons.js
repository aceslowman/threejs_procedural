import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({

});

class CameraCommons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            zoom: props.camera.zoom
        }
    }

    setZoom(v){
        this.props.camera.zoom = v;
        this.props.camera.updateProjectionMatrix();
        this.setState({zoom: v});
    }
    
    render(){
        return(
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
                    onChange={(e) => this.setZoom(e.target.value)}
                />
                <Slider
                    id="zoom"
                    min={0}
                    max={10}
                    value={Number(this.props.camera.zoom)}
                    onChange={(e, v) => this.setZoom(v)}
                />
            </Grid>
        );
    }        
}

export default withStyles(styles)(CameraCommons);