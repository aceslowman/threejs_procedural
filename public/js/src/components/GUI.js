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
import Typography from '@material-ui/core/Typography';

import Navigation from './Navigation';

class GUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      currentGroup: 'World'
    };
  }

  handleDrawerOpen(){
    this.setState({ open: true });
  };

  handleDrawerClose(){
    this.setState({ open: false });
  };

  selectGroup(group){
    this.setState({currentGroup: group});
    this.handleDrawerOpen()
  }

  render() {
    return (
        <Drawer 
          id="GUI"
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
            {/* <Grid item>
              <Typography 
                variant="h1" 
                style={{ 
                  fontSize: '2.3em', 
                  display: this.state.open ? 'block' : 'none', 
                  paddingTop:15
                }}
                gutterBottom
                >
                  Procedural Tools
                </Typography>
            </Grid> */}
            <Grid item>
              <IconButton onClick={() => this.state.open ? this.handleDrawerClose() : this.handleDrawerOpen()}>
                {this.state.open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Grid>
          </Grid>

          <Divider />
          <Navigation 
            handleDrawerClose={() => this.handleDrawerClose()} 
            handleDrawerOpen={() => this.handleDrawerOpen()} 
            selectGroup={(g) => this.selectGroup(g)}
            currentGroup={this.state.currentGroup}
          />
          <Divider />

          {this.props.children && React.Children.map(this.props.children, (child, i) => child && React.cloneElement(child, {
            display: this.state.currentGroup == child.key ? true : false
          }))}

        </Drawer>
    );
  }
}

export default withRouter(GUI);