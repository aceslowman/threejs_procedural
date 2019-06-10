import React from 'react';
import { withRouter } from 'react-router-dom';
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

  handleMapSelect(map){ 
    this.props.updateDiagramActiveMap(map)
  }

  assembleMaps(){
    let maps = [];

    for(let m in this.props.maps){
      let map = this.props.maps[m];
      let selected;
      this.props.diagrams && this.props.diagrams.activeMap == m ? selected = true : selected = false; 

      maps.push(<MapTools key={m} map={map} {...this.props} selected={selected} selectMap={(e)=>this.handleMapSelect(e)}/>);
    }

    return maps;
  }

  render() {
    const {classes} = this.props;

    return (
      <div className="subnavigation">
        {this.assembleMaps()}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Terrain));