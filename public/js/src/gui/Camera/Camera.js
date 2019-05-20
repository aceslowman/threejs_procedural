import React from 'react';
import * as dg from "dis-gui";
import { Route, Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import FirstPersonIcon from '@material-ui/icons/PermIdentity';
import OrthoIcon from '@material-ui/icons/GridOn';
import PerspIcon from '@material-ui/icons/Visibility';


// import subgui
import FirstPersonCameraTools from './subgui/FirstPersonCameraTools.js';
import OrthographicCameraTools from './subgui/OrthographicCameraTools';
import PerspectiveCameraTools from './subgui/PerspectiveCameraTools';

export default class Camera extends React.Component {
  constructor(props){
    super(props);

    this.controls = [];

    this.style = {
      nav: {
        textDecoration: 'none'
      }
    }

    this.state = {

    }
  }

  assembleControls(){
    this.controls = []; //clear

    // console.log(this.props.cameras);
    // if (this.props.cameras) {
    //   this.controls.push(
    //     <dg.Number 
    //       key={0} 
    //       label='FOV' 
    //       value={this.props.cameras["Primary Camera"].fov} 
    //       min={0} 
    //       max={30} 
    //       step={0.1} 
    //       onChange={(v) => this.props.updateCamera("Primary Camera", 'fov', v)} 
    //     />);
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.assembleControls();
    }
  }

  componentDidMount(){
    this.assembleControls();
  }

  render(){
    return (
      <div className="subnavigation">
        {/* <nav>
          <ul>
            <li>
              <Link to="/camera/firstperson/">👁</Link>
            </li>
            <li>
              <Link to="/camera/ortho/">▦</Link>
            </li>
            <li>
              <Link to="/camera/perspective/">⌆</Link>
            </li>
          </ul>
        </nav> */}
        <Grid className="subnav" container spacing={this.state.open ? 0 : 0} alignItems="center" justify="center">
          <Grid item>
            <Button component={Link} to="/camera/firstperson/" disableRipple={true} fullWidth={true} onClick={() => this.handleDrawerOpen()}><FirstPersonIcon style={{fontSize: 18}}/></Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/camera/ortho/" fullWidth={true}><OrthoIcon style={{fontSize: 18}}/></Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/camera/perspective/" fullWidth={true}><PerspIcon style={{fontSize: 18}}/></Button>
          </Grid>
        </Grid>
        <Divider />
        <Paper
          style={{padding:16}}
          elevation={0}  
          square={true}
        >
          <Route path="/camera/" exact component={PerspectiveCameraTools} />
          <Route path="/camera/firstperson/" exact component={FirstPersonCameraTools} />
          <Route path="/camera/ortho/" exact component={OrthographicCameraTools} />
          <Route path="/camera/perspective/" exact component={PerspectiveCameraTools} />
        </Paper>
      </div>
    );
  }
}
