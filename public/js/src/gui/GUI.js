import React from 'react';
import { HashRouter, Route, Link} from "react-router-dom";
import { toolbar_style } from './style';


// Material UI
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeft from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRight from '@material-ui/icons/ChevronRightTwoTone';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import TerrainIcon from '@material-ui/icons/TerrainTwoTone';
import FloraIcon from '@material-ui/icons/LocalFloristTwoTone';
import FaunaIcon from '@material-ui/icons/PetsTwoTone';
import CityIcon from '@material-ui/icons/LocationCityTwoTone';
import CameraIcon from '@material-ui/icons/CameraEnhanceTwoTone';


import CameraContainer from './Camera/CameraContainer';
import TerrainContainer from './Terrain/TerrainContainer';
// TODO: FILL IN THE REST WHEN THE DESIGN IS FINALIZED

export default class Toolbar extends React.Component {
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
    return (
      <HashRouter>
        <Drawer 
          variant="permanent"
          classes={{
            root: this.state.open ? 'tooldrawer_open' : 'tooldrawer_closed',
            paper: this.state.open ? 'tooldrawer_open' : 'tooldrawer_closed'
          }}>
          <Grid 
            container 
            spacing={0}
            direction={this.state.open ? 'row' : 'column'}
            justify={'space-between'}
            alignItems={'center'}>

            <Grid item>
              <h1 style={{paddingLeft: 15, display: this.state.open ? 'block' : 'none'}}>Procedural Tools</h1>
            </Grid>
            <Grid item>
              <IconButton onClick={() => this.state.open ? this.handleDrawerClose() : this.handleDrawerOpen()}>
                {this.state.open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={this.state.open ? 0 : 0} alignItems="center" justify="center">
            <Grid item>
              <Button component={Link} to="/terrain/" disableRipple={true} fullWidth={true} onClick={()=>this.handleDrawerOpen()}><TerrainIcon /></Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/flora/" fullWidth={true} onClick={()=>this.handleDrawerOpen()}><FloraIcon /></Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/fauna/" fullWidth={true} onClick={()=>this.handleDrawerOpen()}><FaunaIcon /></Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/city/" fullWidth={true} onClick={()=>this.handleDrawerOpen()}><CityIcon /></Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/camera/" fullWidth={true} onClick={()=>this.handleDrawerOpen()}><CameraIcon /></Button>
            </Grid>
          </Grid>
          <Divider />
          {/* <div id="subwrapper">
            <Route path="/" exact component={TerrainContainer} />
            <Route path="/camera/" component={CameraContainer} />
            <Route path="/terrain/" component={TerrainContainer} />
          </div> */}
        </Drawer>
      </HashRouter>
    );
  }
}
