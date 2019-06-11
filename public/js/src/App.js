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

import store from './redux/store';

const theme = createMuiTheme({
  typography: {
    fontSize: 12
  },
  spacing: {
    unit: 4
  },
  shape: {
    borderRadius: 2
  },
  palette: {
    type: 'dark',
    background: '#ccc'
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene    = new THREE.Scene();

    this.entities = [];

    this.state = {
      allReady: false,
      cameraReady: false,
      terrainReady: false
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

  handleTerrainReady(terrain){
    this.terrain = terrain;
    this.setState({terrainReady: true});
  }

  //LIFECYCLE-----------------------------------------------------
  componentDidMount() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);

    this.registerListeners();
    this.setupStats();
    this.start();
  }

  componentDidUpdate(){
    if(this.state.cameraReady){
      console.log('CAMERA READY!');
    }

    if(this.state.terrainReady){
      console.log('TERRAIN READY!');
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
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
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

    this.renderer.render(this.scene, this.camera);

    this.terrain.update();
    this.stats.end();
  }

  handleSketchReady(){
    this.setState({sketchReady: true});
  }

  render() {
    return (
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <div className="container">
              <GUI ready={this.state.sketchReady}>
                {<Camera 
                  renderer={this.renderer} 
                  width={this.width} 
                  height={this.height} 
                  cameraUpdate={(c) => this.handleCameraUpdate(c)} 
                  cameraReady={(c) => this.handleCameraReady(c)} 
                />}
                {<Terrain 
                  renderer={this.renderer} 
                  scene={this.scene} 
                  width={512} 
                  height={512} 
                  detail={512} 
                  amplitude={150} 
                  terrainReady={(t) => this.handleTerrainReady(t)} 
                />}
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
