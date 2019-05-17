import React from 'react';
import * as dg from "dis-gui";

export default class Terrain extends React.Component {
  constructor(props){
    super(props);
    this.elements = [];

    this.state = {
      maps: props.data,
      elements: []
    }
  }

  assembleGUI() {
    // TODO: i believe this is being called too many times, should be checked for changes
    let mesh_elements = [];
    this.elements = [];

    let p_k = 0;

    // configure mesh settings
    for(let p in this.props.terrain){
      let param = this.props.terrain[p];

      if(typeof param === 'number'){
        mesh_elements.push(
          <dg.Number
            key={p_k++}
            label={p}
            value={param}
            step={0.01}
            onChange={(val) => this.props.updateTerrain(p, val)}
          />
        );
      }else if(typeof param === 'string'){
        mesh_elements.push(
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

    // push new folder
    this.elements.push(
      <dg.Folder key={p_k++} label='Terrain' expanded={true}>
        {mesh_elements}
      </dg.Folder>
    );

    // TODO: i believe this is being called too many times, should be checked for changes
    let elements = [];

    let elev_elements = [];
    let m_k = 0;
    let k = 0;

    for (let m in this.props.maps) {
      let map = this.props.maps[m];

      for (let p in map.passes) {
        let pass = this.props.passes[map.passes[p]];

        let pass_elements = [];
        let p_k = 0;

        pass_elements.push(
          <dg.Checkbox 
            key={p_k++} 
            label='enabled' 
            checked={pass.params.enabled} 
            onChange={(val) => this.props.updatePassParam(map.passes[p], 'enabled', val)} 
          />
        );

        pass_elements.push(
          <dg.Checkbox 
            key={p_k++} 
            label='renderToScreen' 
            checked={pass.params.renderToScreen} 
            onChange={(val) => this.props.updatePassParam(map.passes[p], 'renderToScreen', val)} 
          />
        );

        for (let d in pass.defines) {
          let define = pass.defines[d];
          pass_elements.push(
            <dg.Number
              key={p_k++}
              label={d}
              value={define}
              min={0}
              max={20}
              step={1}
              onFinishChange={(val) => this.props.updatePassDefine(map.passes[p], d, val)}
            />);
        }

        for (let u in pass.uniforms) {
          let uniform = pass.uniforms[u];

          if (typeof uniform.value === 'number') {
            pass_elements.push(
              <dg.Number
                key={p_k++}
                label={u}
                value={uniform.value}
                step={0.01}
                onChange={(val) => this.props.updatePassUniform(map.passes[p], u, val)}
              />
            );
          } else if (typeof uniform.value === 'object') {
            pass_elements.push(
              <dg.Text
                key={p_k++}
                label={u}
                value={uniform.value.name}
              />
            );
          }
        }

        elev_elements.push(
          <dg.Folder key={m_k} label={pass.id} expanded={true}>
            {pass_elements}
          </dg.Folder>
        );

        m_k++;
      }

      this.elements.push(
        <dg.Folder key={k} label={map.id} expanded={true}>
          {elev_elements}
        </dg.Folder>
      )
    }
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
