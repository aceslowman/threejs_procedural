import React from 'react';
import * as dg from "dis-gui";

export default class MapGUI extends React.Component {
  constructor(props){
    super(props);

    this.guiChanged = props.guiChanged;

    this.state = {
      maps: props.data,
      elements: []
    }
  }

  handleUniformChange(uniform, value){
    console.log(uniform, value);
  }

  handleDefineChange(define, value){
    console.log(define, value);
  }

  assembleShaderGraph() {
    let elements = [];
    let k = 0;

    for(let map of this.props.maps){
      for(let pass of map.composer.passes){
        
        // assemble uniform gui elements
        let uniform_elements = [];
        let uniforms = pass.material.uniforms;
        for(let uniform in uniforms){
          let isNumber = typeof uniforms[uniform].value === 'number';
          if (isNumber) {
            uniform_elements.push(<dg.Number label={uniform} value={uniforms[uniform].value} step={0.001} onChange={(val)=>this.handleUniformChange(uniform, val)}/>);
          } else {
            uniform_elements.push(<dg.Number label={uniform} value={uniforms[uniform].value} onChange={(val)=>this.handleUniformChange(uniform, val)}/>);
          }
        }
      
        // assemble define gui elements
        let define_elements = [];
        let defines = pass.material.defines;
        for (let define in defines) {
          console.log(defines[define])
          define_elements.push(<dg.Number label={define} value={defines[define]} min={0} max={20} step={1} onChange={(val)=>this.handleDefineChange(define, val)}/>);
        }
        
        elements.push(
          <dg.Folder key={k} label={pass.material.name}>
            {define_elements}
            {uniform_elements}
          </dg.Folder>
        );

        k++;
      }
      
      this.elements = elements;
    }
  }

  render(){
    // this.assembleShaderGraph();

    return (
      <dg.GUI style={{position: 'relative', left: 0, top:0}}>
        { this.elements }
      </dg.GUI>
    );
  }
}
