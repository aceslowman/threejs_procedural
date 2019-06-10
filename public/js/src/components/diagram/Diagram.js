import React from 'react';
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget, PortModel } from "storm-react-diagrams";

require("storm-react-diagrams/dist/style.min.css");

class Diagram extends React.Component {
  constructor(props) {
    super(props);

    // TODO: store an array of models, which contain nodes and links
    this.nodes = [];
    this.links = [];

    this.state = {
      open: false,
      currentMap: this.props.maps.byId[this.props.maps.allIds[0]]
    };
  }
  
  componentWillMount(){
    this.engine = new DiagramEngine();
    this.engine.installDefaultFactories();

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

  handlePassSelect(e){
    console.log('hit');
    this.props.selectPass(e.entity.id);
  }

  assembleDiagram(){
    if(this.state.currentMap){
      this.nodes = [];
      this.links = [];

      let i = 0; 

      //hold on to previous out port to link passes
      let prevOutPort; 

      for (let p in this.state.currentMap.passes) {
        let pass_id = this.state.currentMap.passes[p];
        let pass = this.props.passes.byId[pass_id];

        let node = new DefaultNodeModel(pass.name, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`);
     
        // hijacking node id, for association with pass id
        node.id = pass_id;

        // now I need to make sure the selected pass is highlighted
        node.selected = this.props.diagrams.activePass == pass_id ? true : false;

        let inPort = node.addInPort("In");
        let outPort = node.addOutPort("Out");
        node.setPosition(25 + (i*100),25);

        this.nodes.push(node);
        if (prevOutPort) this.links.push(inPort.link(prevOutPort));

        prevOutPort = outPort;
        i++;
      }

      let model = new DiagramModel();

      let models = model.addAll(...this.nodes, ...this.links);

      models.forEach(item => {
        item.addListener({
          selectionChanged: (e) => this.handlePassSelect(e)
        });
      });

      this.engine.setDiagramModel(model);
    } 
  }

  render() {
    return (
      <div>
        {this.state.open && 
        (<div className="diagramContainer">
          <h3>{this.state.currentMap.name}</h3>
          <DiagramWidget className="srd-demo-canvas" diagramEngine={this.engine} allowLooseLinks={false} />
        </div>)}
      </div>
    );
  }
}

export default Diagram;