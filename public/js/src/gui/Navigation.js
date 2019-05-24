import React from 'react';
import { withRouter, HashRouter, Route, Link } from "react-router-dom";

import TerrainIcon from '@material-ui/icons/Terrain';
import FloraIcon from '@material-ui/icons/LocalFlorist';
import FaunaIcon from '@material-ui/icons/Pets';
import CityIcon from '@material-ui/icons/LocationCity';
import CameraIcon from '@material-ui/icons/CameraEnhance';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({

});

class Navigation extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        let location = this.props.location.pathname;

        return(
            <Grid container spacing={this.state.open ? 0 : 0} alignItems="center" justify="space-evenly">

                <Grid item>
                    <Tooltip disableFocusListener title="Terrain">
                        <IconButton
                            color={location.includes('terrain') ? 'primary' : 'default'}
                            component={Link}
                            to="/terrain/"
                            disableRipple={true}
                            onClick={() => this.props.handleDrawerOpen()}
                        >
                            <TerrainIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Flora">
                        <IconButton
                            color={location.includes('flora') ? 'primary' : 'default'}
                            component={Link}
                            to="/flora/"
                            onClick={() => this.props.handleDrawerOpen()}
                        >
                            <FloraIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Fauna">
                        <IconButton
                            color={location.includes('fauna') ? 'primary' : 'default'}
                            component={Link}
                            to="/fauna/"
                            onClick={() => this.props.handleDrawerOpen()}
                        >
                            <FaunaIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="City">
                        <IconButton
                            color={location.includes('city') ? 'primary' : 'default'}
                            component={Link}
                            to="/city/"
                            onClick={() => this.props.handleDrawerOpen()}
                        >
                            <CityIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip disableFocusListener title="Camera">
                        <IconButton
                            color={location.includes('camera') ? 'primary' : 'default'}
                            component={Link}
                            to="/camera/"
                            onClick={() => this.props.handleDrawerOpen()}>
                            <CameraIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }
};

export default withStyles(styles)(withRouter(Navigation));