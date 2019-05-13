import React from 'react';
import * as dg from "dis-gui";

export default class CameraGUI extends React.Component {
  constructor(props){
    super(props);

    this.elements = [];

    this.state = {

    }
  }

  assembleGUI(){
    this.elements = []; //clear

    if (this.props.cameras) {
      this.elements.push(<dg.Number key={0} label='FOV' value={this.props.cameras["Primary Camera"].fov} min={0} max={30} step={0.1} onChange={(v) => this.props.updateCamera("Primary Camera", 'fov', v)} />);
    }
  }

  render(){
    this.assembleGUI();

    return (
      <dg.GUI style={{position: 'relative', left: 0, top:0}}>
        {this.elements}
      </dg.GUI>
    );
  }
}
