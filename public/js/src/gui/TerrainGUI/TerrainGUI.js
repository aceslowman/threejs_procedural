import React from 'react';
import * as dg from "dis-gui";

export default class MapGUI extends React.Component {
  constructor(props){
    super(props);
    this.elements = [];
  }

  assembleGUI() {
    // TODO: i believe this is being called too many times, should be checked for changes
    let terrain_elements = [];
    this.elements = [];

    let p_k = 0;

    for(let p in this.props.terrain){
      let param = this.props.terrain[p];

      if(typeof param === 'number'){
        terrain_elements.push(
          <dg.Number
            key={p_k++}
            label={p}
            value={param}
            step={0.01}
            onChange={(val) => this.props.updateTerrain(p, val)}
          />
        );
      }else if(typeof param === 'string'){
        terrain_elements.push(
          <dg.Text
            key={p_k++}
            label={p}
            value={param}
          />
        );
      }else {
        console.warn('terrain parameter not mapped to GUI');
      }
    }

    this.elements.push(
      <dg.Folder key={p_k++} label='Terrain' expanded={true}>
        {terrain_elements}
      </dg.Folder>
    )
  }

  render(){
    this.assembleGUI();

    return (
      <dg.GUI style={{
          position: 'relative',
          left: 0,
          top: 0,
          backgroundColor: '#000',
        }}>
        {this.elements}
      </dg.GUI>
    );
  }
}
