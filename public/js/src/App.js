import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import GUI from './components/GUI';
import Diagram from './components/diagram/DiagramContainer';

import * as THREE from 'three';
import Stats from "stats-js";
import Camera from './components/camera/CameraContainer';
import Terrain from './components/terrain/TerrainContainer';
import Renderer from './components/renderer/Renderer';

import store from './redux/store';

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
    useNextVariants: true
  },
  spacing: {
    unit: 4
  },
  shape: {
    borderRadius: 2
  },
  palette: {
    // type: 'dark',
    // background: '#ccc'
  },
  overrides: {
    MuiPaper: {
      // border: '1px solid rgba(255, 255, 255, 0.12)'
    }
  }
});

class App extends React.Component {
  constructor(props){
    super(props);

    this.clock    = new THREE.Clock();
    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene    = new THREE.Scene();

    //TEMP
    // this.renderer.setClearColor('blue');

    this.entities = [];

    this.state = {
      allReady: false,
      cameraReady: false,
      terrainReady: false,
      canvasReady: false,
      width: '',
      height: '',
      startFlag: false,
      renderer: null
    }
  }

  setupStats() {
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '0px';
    this.stats.domElement.style.left = '';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.style.top = '';
    this.stats.domElement.style.display = 'visible';
    document.getElementById('APP').appendChild(this.stats.domElement);
  }

  handleCameraReady(cam) {
    this.camera = cam;
    this.setState({cameraReady: true});
  }

  handleCameraChange(cam) {
    this.camera = cam;
  }

  handleTerrainReady(terrain){
    this.terrain = terrain;
    this.setState({terrainReady: true});
  }

  handleRendererChange(renderer) {
    // renderer.setSize(this.width, this.height);
    this.setState({renderer: renderer});

    // TODO: this.mount is not available yet.
    // this.mount.appendChild(this.state.renderer.domElement);
    // document.getElementById('APP').appendChild(this.state.renderer.domElement);
    if(this.mount) console.log('MOUNT EXISTS, back 2 handleRendererChange()');
    // this.mount.appendChild(renderer.domElement);
  }

  handleSketchReady() {
    this.setState({ sketchReady: true });
  }

  //LIFECYCLE-----------------------------------------------------
  componentDidMount() {
    // this.width = this.mount.clientWidth;
    // this.height = this.mount.clientHeight;

    // this.state.renderer.setSize(width, height);
    if (this.state.renderer) console.log("renderer exists! come back to componentDidMount")
    // this.mount.appendChild(this.state.renderer.domElement);

    this.registerListeners();
    this.setupStats();

    this.setState({ 
      width: this.mount.clientWidth, 
      height: this.mount.clientHeight,
      canvasReady: true,
      startFlag: true 
    });
  }

  componentDidUpdate(){
    if(this.state.cameraReady){
      console.log('CAMERA READY!');
    }

    if(this.state.terrainReady){
      console.log('TERRAIN READY!');
    }

    if(this.state.startFlag){
      this.start();
      this.setState({startFlag: false})
    }
  }

  componentWillUnmount() {
    this.removeListeners();
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  //LISTENERS-----------------------------------------------------
  registerListeners(){
    window.addEventListener('resize', this.handleResize);
  }

  removeListeners(){
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    let width = this.mount.clientWidth;
    let height = this.mount.clientHeight;

    this.renderer.setSize(width, height);

    this.setState({ 
      width: this.mount.clientWidth, 
      height: this.mount.clientHeight 
    });
  }

  //--------------------------------------------------------------
  start = () => {
    if (!this.frameId) this.frameId = requestAnimationFrame(this.animate);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    this.stats.begin();

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
    
    this.state.renderer.render(this.scene, this.camera);

    this.stats.end();
  }

  render() {
    return (
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <div className="container">
              <GUI ready={this.state.sketchReady}>
                <Renderer
                  setRenderer={(r) => this.handleRendererChange(r)}
                  width={this.state.width}
                  height={this.state.height} 
                />
                {
                  this.state.canvasReady && <Terrain
                    renderer={this.state.renderer}
                    scene={this.scene}
                    width={512}
                    height={512}
                    detail={512}
                    amplitude={150}
                    terrainReady={(t) => this.handleTerrainReady(t)}
                  />
                }                 
                {
                  this.state.canvasReady && <Camera 
                  renderer={this.state.renderer} 
                  scene={this.scene} 
                  width={this.state.width} 
                  height={this.state.height} 
                  cameraReady={(c) => this.handleCameraReady(c)} 
                  cameraChange={(c) => this.handleCameraChange(c)}
                />
                }
              </GUI>
              <div id="SKETCHCONTAINER">
                <div id="APP" ref={mount => { this.mount = mount }} />
                <Diagram ready={this.state.sketchReady} />
              </div>
            </div>
          </Provider>
        </MuiThemeProvider>
      </HashRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
