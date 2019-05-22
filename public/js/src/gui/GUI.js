import React from 'react';
import {withRouter, HashRouter, Route, Link} from "react-router-dom";

// Material UI
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import TerrainIcon from '@material-ui/icons/Terrain';
import FloraIcon from '@material-ui/icons/LocalFlorist';
import FaunaIcon from '@material-ui/icons/Pets';
import CityIcon from '@material-ui/icons/LocationCity';
import CameraIcon from '@material-ui/icons/CameraEnhance';

// CONTAINERS
import CameraContainer from './Camera/CameraContainer';
import TerrainContainer from './Terrain/TerrainContainer';

class GUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  handleDrawerOpen(){
    this.setState({ open: true });
  };

  handleDrawerClose(){
    this.setState({ open: false });
  };

  render() {
    console.log("HERE", this.props.location.pathname);
    let location = this.props.location.pathname;

    return (

        <Drawer 
          variant="permanent"
          classes={{
            root: this.state.open ? 'tooldrawer_open' : 'tooldrawer_closed',
            paper: this.state.open ? 'tooldrawer_open' : 'tooldrawer_closed'
          }}
        >
          <Grid 
            container 
            spacing={0}
            direction={this.state.open ? 'row' : 'column'}
            justify={'space-between'}
            alignItems={'center'}
            style={{ padding: this.state.open ? '0px 15px' : '15px 0px' }}
          >
            <Grid item>
              <h1 style={{display: this.state.open ? 'block' : 'none', wordBreak: 'break-all'}}>Procedural Tools</h1>
            </Grid>
            <Grid item>
              <IconButton onClick={() => this.state.open ? this.handleDrawerClose() : this.handleDrawerOpen()}>
                {this.state.open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={this.state.open ? 0 : 0} alignItems="center" justify="space-evenly">
            
            <Grid item>
              <Tooltip disableFocusListener title="Terrain">
                <IconButton 
                  color={location.includes('terrain') ? 'primary' : ''}
                  component={Link} 
                  to="/terrain/" 
                  disableRipple={true} 
                  fullWidth={true} onClick={()=>this.handleDrawerOpen()}
                >
                  <TerrainIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
              <Tooltip disableFocusListener title="Flora">
                <IconButton 
                  color={location.includes('flora') ? 'primary' : ''}
                  component={Link} 
                  to="/flora/" 
                  fullWidth={true} 
                  onClick={()=>this.handleDrawerOpen()}
                >
                  <FloraIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
              <Tooltip disableFocusListener title="Fauna">
                <IconButton 
                  color={location.includes('fauna') ? 'primary' : ''}
                  component={Link} 
                  to="/fauna/" 
                  fullWidth={true} 
                  onClick={()=>this.handleDrawerOpen()}
                >
                  <FaunaIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
              <Tooltip disableFocusListener title="City">
                <IconButton 
                  color={location.includes('city') ? 'primary' : ''}
                  component={Link} 
                  to="/city/" 
                  fullWidth={true} 
                  onClick={()=>this.handleDrawerOpen()}
                >
                  <CityIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
                <Tooltip disableFocusListener title="Camera">
                <IconButton 
                  color={location.includes('camera') ? 'primary' : ''}
                  component={Link} 
                  to="/camera/" 
                  fullWidth={true} 
                  onClick={()=>this.handleDrawerOpen()}>
                  <CameraIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          <Divider />

          <div id="subwrapper" style={ {display: this.state.open ? 'block' : 'none'} }>
            <Route path="/" exact component={CameraContainer} />
            <Route path="/camera/" component={CameraContainer} />
            <Route path="/terrain/" component={TerrainContainer} />
          </div>

        </Drawer>

    );
  }
}

export default withRouter(GUI);