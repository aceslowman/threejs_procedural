import React from 'react';
import * as dg from "dis-gui";

export default class MapGUI extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      maps: props.data,
      elements: []
    }
  }

  assembleShaderGraph() {
    let elements = [];
    
    let map_elements = [];
    let m_k = 0;
    let k = 0;
    
    for(let m in this.props.maps){
      let map = this.props.maps[m];

      for(let p in map.passes){
        let pass = this.props.passes[map.passes[p]];

        let define_elements = [];
        let d_k = 0;
        for(let d in pass.defines){
          let define = pass.defines[d];
          define_elements.push(
            <dg.Number
              key={d_k} 
              label={d} 
              value={define} 
              min={0} 
              max={20} 
              step={1} 
              onFinishChange={(val)=>this.props.updatePassDefine(map.passes[p], d, val)}
            />);

          d_k++;
        }

        let uniform_elements = [];
        let u_k = 0;
        for(let u in pass.uniforms){
          let uniform = pass.uniforms[u];

          if (typeof uniform.value === 'number') {
            uniform_elements.push(
              <dg.Number 
                key={u_k}
                label={u} 
                value={uniform.value} 
                step={0.01} 
                onChange={(val)=>this.props.updatePassUniform(map.passes[p], u, val)}
              />
            );
          } else if (typeof uniform.value === 'object'){
            uniform_elements.push(
              <dg.Text 
                key={u_k} 
                label={u} 
                value={uniform.value.name} 
              />
            );
          }

          u_k++;
        }

        map_elements.push(
          <dg.Folder key={m_k} label={pass.id} expanded={false}>
            {define_elements}
            {uniform_elements}
          </dg.Folder>
        );

        m_k++;
      }

      elements.push(
        <dg.Folder key={k} label={map.id} expanded={true}>
          {map_elements}
        </dg.Folder>
      )
    }

    this.elements = elements;
  }

  render(){
    this.assembleShaderGraph();

    return (
      <dg.GUI style={{position: 'relative', left: 0, top:0}}>
        { this.elements }
      </dg.GUI>
    );
  }
}
