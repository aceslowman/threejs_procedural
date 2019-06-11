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

        this.state = {
            view: props.view
        }
    }

    componentDidMount(){
        this.changeView(this.props.view);
    }

    changeView(view){
        this.props.camera.up.set(0, 0, 1);

        switch (view) {
            case 'SIDE':
                this.props.camera.position.set(1100, 0, 0);
                this.props.camera.lookAt(0, 0, 0);
                break;
            case 'TOP':
                this.props.camera.position.set(0, 0, 1000);
                this.props.camera.lookAt(0, 0, 0);
                break;
            case 'ANGLE':
                this.props.camera.position.set(600, 600, 600);
                this.props.camera.lookAt(0, 0, 0);
                break;
        }

        this.props.camera.updateMatrixWorld();
        this.setState({view: view});
    }

    render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Grid
                    container
                    justify={'space-around'}
                    alignItems={'center'}
                    spacing={16}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Camera Views</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={()=>this.changeView("SIDE")} fullWidth variant="outlined">Side</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={()=>this.changeView("TOP")} fullWidth variant="outlined">Top</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={()=>this.changeView("ANGLE")} fullWidth variant="outlined">Angle</Button>
                    </Grid>
                </Grid>  
            </Paper>

        );
    }
}

export default withStyles(styles)(CameraViews);