import React from 'react';

import SketchContext from '../../../SketchContext';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { Divider } from '@material-ui/core'; 

import FirstPerson from './transform/FirstPerson';
import Orbit from './transform/Orbit';
import Turntable from './transform/Turntable';
import Possession from './transform/Possession';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class CameraTransform extends React.Component {
    static contextType = SketchContext;

    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            active: 'FirstPerson'
        };
    }

    changeActiveTransform(transform) {
        this.setState({ active: transform });
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={12}>
                <Paper className={classes.root}>
                    <Grid container justify={'space-around'} alignItems={'center'} spacing={16}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">Transform</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                color={this.state.active && this.state.active == "Turntable" ? 'primary' : 'default'}
                                onClick={() => this.changeActiveTransform("Turntable") /*TODO: fix*/}
                                fullWidth
                                variant="outlined"
                            >
                                Turntable
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                color={this.state.active && this.state.active == "Orbit" ? 'primary' : 'default'}
                                onClick={() => this.changeActiveTransform("Orbit") /*TODO: fix*/}
                                fullWidth
                                variant="outlined"
                            >
                                Orbit
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            <Button
                                color={
                                    this.state.active && this.state.active == "FirstPerson" ? 'primary' : 'default'}
                                onClick={() => this.changeActiveTransform("FirstPerson") /*TODO: fix*/}
                                fullWidth
                                variant="outlined"
                            >
                                First Person
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>


                <FirstPerson default {...this.props} setActive={(t)=>this.changeActiveTransform(t)}/>
            </Grid>
        );
    }
};

export default withStyles(styles)(CameraTransform);