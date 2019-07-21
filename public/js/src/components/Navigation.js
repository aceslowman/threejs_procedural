import React from 'react';
import { withRouter, HashRouter, Route, Link } from "react-router-dom";

import TerrainIcon from '@material-ui/icons/Terrain';
import FloraIcon from '@material-ui/icons/LocalFlorist';
import FaunaIcon from '@material-ui/icons/Pets';
import CityIcon from '@material-ui/icons/LocationCity';
import CameraIcon from '@material-ui/icons/CameraEnhance';
import BuildIcon from '@material-ui/icons/Build';
import SunIcon from '@material-ui/icons/WbSunny';
import WorldIcon from '@material-ui/icons/Public';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({

});

class Navigation extends React.Component {
    static displayName = 'Navigation';

    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return(
            <Grid container spacing={this.state.open ? 0 : 0} alignItems="center" justify="space-evenly">

                <Grid item>
                    <Tooltip disableFocusListener title="Terrain">
                        <IconButton
                            color={this.props.currentGroup == "Terrain" ? 'primary' : 'default'}
                            onClick={() => this.props.selectGroup("Terrain")}
                        >
                            <TerrainIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Physics">
                        <IconButton
                            color={this.props.currentGroup == "Physics" ? 'primary' : 'default'}
                            onClick={() => this.props.selectGroup("Physics")}
                        >
                            <WorldIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Renderer">
                        <IconButton
                            color={this.props.currentGroup == "Renderer" ? 'primary' : 'default'}
                            onClick={() => this.props.selectGroup("Renderer")}
                        >
                            <BuildIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Sky">
                        <IconButton
                            color={this.props.currentGroup == "Sky" ? 'primary' : 'default'}
                            onClick = {
                                () => this.props.selectGroup("Sky")
                            }
                        >
                            <SunIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Camera">
                        <IconButton
                            color={this.props.currentGroup == "Camera" ? 'primary' : 'default'}
                            onClick = {
                                () => this.props.selectGroup("Camera")
                            } >
                            <CameraIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>                
            </Grid>
        )
    }
};

export default withStyles(styles)(Navigation);