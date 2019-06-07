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

    this.state = {
      open: true,
      currentMap: this.props.maps.byId[this.props.maps.allIds[0]]
    };
  }
  
  componentDidMount(){
    // get random map for now
    let map = this.props.maps.byId[this.props.maps.allIds[0]];

    this.setState({currentMap: map})
  }

  handleDrawerOpen(){
    this.setState({ open: true });
  };

  handleDrawerClose(){
    this.setState({ open: false });
    //TODO: do I need to unmount?
  };

  assembleDiagram(){
    // use the current map in state
    this.nodes = [];
    this.links = [];

    if(this.state.currentMap){
      let i = 0; 
      let prevOutPort; //hold on to previous out port to link passes

      for (let p in this.state.currentMap.passes) {
        let pass_id = this.state.currentMap.passes[p];
        let pass = this.props.passes.byId[pass_id];

        let node = new DefaultNodeModel(pass.name, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`);
        let inPort = node.addInPort("In");
        let outPort = node.addOutPort("Out");
        node.setPosition(100 + (i*100),50);

        this.nodes.push(node);
        if (prevOutPort) this.links.push(inPort.link(prevOutPort));

        prevOutPort = outPort;
        i++;
      }
    }
  }

  render() {
    this.assembleDiagram();

    const engine = new DiagramEngine();
    engine.installDefaultFactories();

    let model = new DiagramModel();

    // var node1 = new DefaultNodeModel("Fractal Warp", "rgb(0,192,255)");
    // var port1 = node1.addOutPort("Out");
    // // can I add custom port models here?
    // // node1.addInPort("Something");
    // // node1.addInPort("SomethingELSE");
    // node1.setPosition(100, 100);
    
    // //3-B) create another default node
    // var node2 = new DefaultNodeModel("Fractal Noise", "rgb(192,255,0)");
    // var port2 = node2.addInPort("In");
    // node2.setPosition(400, 100);

    // //3-C) link the 2 nodes together
    // var link1 = port1.link(port2);

    // //4) add the models to the root graph

    // let models = model.addAll(node1, node2, link1);

    let models = model.addAll(...this.nodes, ...this.links);

    models.forEach(item => {
      item.addListener({
        selectionChanged: (e) => { console.log(e); }
      });
    });

    //5) load model into engine
    engine.setDiagramModel(model);

    return (
      <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} allowLooseLinks={false} />
    );
  }
}

export default Diagram;