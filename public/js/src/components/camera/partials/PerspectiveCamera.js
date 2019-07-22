import React from 'react';
import * as THREE from 'three';
import SketchContext from '../../../SketchContext';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class PerspectiveCamera extends React.Component {
    static contextType = SketchContext;

    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;

        this.state = {
            focalLength: 0
        };
    }

    componentDidMount(){
        this.camera = new THREE.PerspectiveCamera(
            75,                         // fov
            this.width / this.height,   // aspect
            0.01,                       // near
            2000                        // far
        );

        this.camera.name = "PerspectiveCamera";

        this.setState({focalLength: this.camera.getFocalLength()})

        if (this.props.default) this.props.setActive(this.camera)
    }

    setFocalLength(v) {
        this.camera.setFocalLength(v);
        this.setState({focalLength: this.camera.getFocalLength()})
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

export default withStyles(styles)(PerspectiveCamera);