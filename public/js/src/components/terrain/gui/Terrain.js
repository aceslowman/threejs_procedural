import React from 'react';
import { withRouter, Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MapTools from './subgui/MapTools';

const styles = theme => ({
  root: {
    padding: 8,
    margin: '4px 4px 16px 4px'
  }
});

class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  assembleMaps(){
    let maps = [];

    for(let m in this.props.maps){
      let map = this.props.maps[m];

      maps.push(<MapTools key={m} map={map} {...this.props} />);
    }

    return maps;
  }

  render() {
    this.assembleMaps();
    const {classes} = this.props;

    return (
      <div className="subnavigation">
        {this.assembleMaps()}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));