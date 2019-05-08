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

  handleUniformChange(uniform, value){
    // console.log(uniform, value);
  }

  handleDefineChange(define, value){
    // console.log(define, value);
  }

  assembleShaderGraph() {
    let elements = [];
    
    for(let m in this.props.maps){
      let map = this.props.maps[m];

      for(let p in map.passes){
        let pass = this.props.passes[map.passes[p]];

        let define_elements = [];
        for(let d in pass.defines){
          let define = pass.defines[d];
          define_elements.push(<dg.Number label={d} value={define} min={0} max={20} step={1} onChange={(val)=>this.props.updatePassDefine(m, d, val)} />);
        }

        let uniform_elements = [];
        for(let u in pass.uniforms){
          let uniform = pass.uniforms[u];
          let isNumber = typeof uniform.value === 'number';
          if (isNumber) {
            uniform_elements.push(<dg.Number label={u} value={uniform.value} step={0.001} onChange={(val)=>this.props.updatePassUniform(val)}/>);
          } else {
            uniform_elements.push(<dg.Number label={u} value={uniform.value} onChange={(val)=>this.props.updatePassUniform(val)}/>);
          }
        }

        elements.push(
          <dg.Folder label={pass.id}>
            {define_elements}
            {uniform_elements}
          </dg.Folder>
        );
      }
    }

    // TODO currently not organizing multiple maps, focusing on getting elevation first
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
