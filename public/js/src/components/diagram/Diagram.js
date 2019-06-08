import React from 'react';
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget, PortModel } from "storm-react-diagrams";

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { SwipeableDrawer } from '@material-ui/core';

require("storm-react-diagrams/dist/style.min.css");

class Diagram extends React.Component {
  constructor(props) {
    super(props);

    this.nodes = [];
    this.links = [];

    this.state = {
      open: false,
      currentMap: this.props.maps.byId[this.props.maps.allIds[0]]
    };
  }
  
  componentDidMount(){
    this.assembleDiagram();
  }

  componentDidUpdate(prevProps){
    if(prevProps.diagrams && prevProps.activeMap != this.props.activeMap){
      this.setState({
        currentMap: this.props.activeMap,
        open: true
      });

      this.assembleDiagram();
    }
  }

  assembleDiagram(){
    if(this.state.currentMap){
      this.nodes = [];
      this.links = [];

      let i = 0; 
      let prevOutPort; //hold on to previous out port to link passes

      for (let p in this.state.currentMap.passes) {
        let pass_id = this.state.currentMap.passes[p];
        let pass = this.props.passes.byId[pass_id];

        let node = new DefaultNodeModel(pass.name, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`);
        let inPort = node.addInPort("In");
        let outPort = node.addOutPort("Out");
        node.setPosition(25 + (i*100),25);

        this.nodes.push(node);
        if (prevOutPort) this.links.push(inPort.link(prevOutPort));

        prevOutPort = outPort;
        i++;
      }
    }
  }

  render() {
    const engine = new DiagramEngine();
    engine.installDefaultFactories();

    let model = new DiagramModel();

    if(this.state.currentMap){
      let models = model.addAll(...this.nodes, ...this.links);

      models.forEach(item => {
        item.addListener({
          selectionChanged: (e) => { console.log(e); }
        });
      });
    }

    engine.setDiagramModel(model);

    return (
      <div>
        {this.state.open && 
        (<div className="diagramContainer">
          <h3>{this.state.currentMap.name}</h3>
          <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} allowLooseLinks={false} />
        </div>)}
      </div>
    );
  }
}

export default Diagram;