import React from 'react';
import dat from "dat.gui";

export default class MapGUI {
  constructor(){
    super();
  }

  // this is primarily TOOLBOX relevant
  setupShaderGraphDisplay(map) {
    let container = document.createElement('div');
    let p_ol = document.createElement('ol');
    container.id = 'ShaderGraph';

    for(let pass of map.composer.passes){
      let p_li = document.createElement('li');
      let gui = gui.
      gui.pass = gui.addFolder(pass.material.name);

      gui.pass.add(pass, 'renderToScreen', 0, 1)
      .onChange(()=>{
        pass.material.needsUpdate = true;
        this.terrain.displace();
      });

      gui.pass.add(pass, 'enabled', 0, 1)
      .onChange(()=>{
        pass.material.needsUpdate = true;
        this.terrain.displace();
      });

      gui.pass.defines = gui.pass.addFolder('Defines');
      let defines = pass.material.defines;
      // TODO: I do need some kind of limit on these defines.
      for(let define in defines){
        gui.pass.add(defines, define).min(0).max(20).step(1).name(define)
          .onChange(()=>{
            pass.material.needsUpdate = true;
            this.terrain.displace();
          });
      }

      gui.pass.uniforms = this.state.gui.pass.addFolder('Uniforms');
      let uniforms = pass.material.uniforms;
      for(let uniform in uniforms){
        console.log();
        // if(uniforms[uniform] )
        let isNumber = typeof uniforms[uniform].value === 'number';
        if(isNumber){
          gui.pass.add(uniforms[uniform], "value").step(0.001).name(uniform)
            .onChange(()=>{
              this.terrain.displace();
            });
        }else{
          gui.pass.add(uniforms[uniform], "value").name(uniform)
            .onChange(()=>{
              this.terrain.displace();
            });
        }
      }

      p_li.appendChild(gui.domElement);
      p_ol.appendChild(p_li);
    }

    container.appendChild(p_ol);
    document.getElementById('TOOLBAR').appendChild(container);
  }
}
