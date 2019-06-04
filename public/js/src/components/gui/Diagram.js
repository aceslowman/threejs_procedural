import React from 'react';
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget } from "storm-react-diagrams";

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { SwipeableDrawer } from '@material-ui/core';

require("storm-react-diagrams/dist/style.min.css");

class Diagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  handleDrawerOpen(){
    this.setState({ open: true });
  };

  handleDrawerClose(){
    this.setState({ open: false });
  };

  assembleDiagram(){
    
  }

  render() {
    const engine = new DiagramEngine();
    engine.installDefaultFactories();

    let model = new DiagramModel();

	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addOutPort("Out");
    node1.setPosition(100, 100);
    
    //3-B) create another default node
    var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
    var port2 = node2.addInPort("In");
    node2.setPosition(400, 100);

    //3-C) link the 2 nodes together
    var link1 = port1.link(port2);

    //3-D) create an orphaned node
    var node3 = new DefaultNodeModel("Node 3", "rgb(0,192,255)");
    node3.addOutPort("Out");
    node3.setPosition(100, 200);

    //4) add the models to the root graph
    model.addAll(node1, node2, node3, link1);

    //5) load model into engine
    engine.setDiagramModel(model);

    return (
        <div id="DIAGRAM">
            <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} allowLooseLinks={false} />
        </div>
    );
  }
}

export default Diagram;