import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import GUI from './components/GUI';
import Diagram from './components/diagram/DiagramContainer';

import * as THREE from 'three';

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

    this.entities = [];

    this.state = {
      allReady: false,
      cameraReady: false,
      terrainReady: false,
      canvasReady: false,
      rendererReady: false,
      width: '',
      height: '',
      startFlag: false,
      renderer: null,
      scene: new THREE.Scene()
    }

    this.state.scene.autoUpdate = true;
    this.state.scene.background = new THREE.Color('blue');
  }

  handleCameraReady(cam) {
    this.setState({camera: cam, cameraReady: true});
  }

  handleCameraChange(cam) {
    this.setState({camera: cam})
  }

  handleTerrainReady(terrain){
    this.terrain = terrain;
    this.setState({terrainReady: true});
  }

  handleRendererChange(renderer) {
    this.setState({renderer: renderer});
  }

  handleSketchReady() {
    this.setState({ sketchReady: true });
  }

  //LIFECYCLE-----------------------------------------------------
  componentDidMount() {
    this.registerListeners();

    this.setState({ 
      width: this.mount.clientWidth, 
      height: this.mount.clientHeight,
      canvasReady: true,
      startFlag: true 
    });

    // var intensity = 70000; // raytracer apparently needs HIGH intensity
    let intensity = 0.5;

    var light = new THREE.PointLight(0xffaa55, intensity);
    light.position.set(- 200, 100, 100);
    light.physicalAttenuation = true;
    this.state.scene.add(light);

    var light = new THREE.PointLight(0x55aaff, intensity);
    light.position.set(200, 100, 100);
    light.physicalAttenuation = true;
    this.state.scene.add(light);

    var light = new THREE.PointLight(0xffffff, intensity * 1.5);
    light.position.set(0, 0, 300);
    light.physicalAttenuation = true;
    this.state.scene.add(light);
  }

  onMapRendered(ref){
    console.log("map rendered! notify renderer");
    this.setState({
      rendererReady: true
    })
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
                  camera={this.state.camera}
                  scene={this.state.scene}
                  ready={this.state.rendererReady}
                />
                {
                  this.state.canvasReady && <Terrain
                    renderer={this.state.renderer}
                    scene={this.state.scene}
                    width={512}
                    height={512}
                    detail={512}
                    amplitude={150}
                    terrainReady={(t) => this.handleTerrainReady(t)}
                    mapRendered={(ref)=>this.onMapRendered(ref)}
                  />
                }            
                {
                  this.state.canvasReady && <Camera 
                  renderer={this.state.renderer} 
                  scene={this.state.scene} 
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
