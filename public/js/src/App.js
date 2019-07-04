import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import GUI from './components/GUI';
import Diagram from './components/diagram/DiagramContainer';

import * as THREE from 'three';

import Camera from './components/camera/Camera';
import Terrain from './components/terrain/Terrain';
import Renderer from './components/renderer/RendererContainer';

import store from './redux/store';

import {SketchProvider} from './SketchContext'

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

    this.state = {
      width: '',
      height: '',
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(),
      clock: new THREE.Clock(),
      renderer: '',
    }
  }

  //------------------------------------------------------------------------
  componentDidMount() {
    this.registerListeners();

    /*
      set width and height, now that the canvas has been mounted
    */
    this.setState({ 
      width: this.mount.clientWidth, 
      height: this.mount.clientHeight
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

  //------------------------------------------------------------------------
  registerListeners(){
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    let width = this.mount.clientWidth;
    let height = this.mount.clientHeight;

    this.state.renderer.setSize(width, height);

    this.setState({ 
      width: this.mount.clientWidth, 
      height: this.mount.clientHeight 
    });
  }

  //------------------------------------------------------------------------
  render() {

    /*
      the SketchContext will share a few important webgl related objects
      to all child components.
    */
    let sketchCtx = {
      renderer: this.state.renderer,
      clock: this.state.clock,
      scene: this.state.scene
    }

    return (
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <SketchProvider value={sketchCtx}>
            <Provider store={store}>
              <div className="container">
                <GUI ready={this.state.sketchReady}>
                  <Renderer
                    width={this.state.width}
                    height={this.state.height}
                    camera={this.state.camera}
                    scene={this.state.scene}
                    onRef={ref => this.setState({ renderer: ref })}
                  />
                  {
                    this.state.renderer && <Camera
                      renderer={this.state.renderer}
                      scene={this.state.scene}
                      width={this.state.width}
                      height={this.state.height}
                      onRef={ref => this.setState({ camera: ref })}
                    />
                  }
                  {
                    this.state.renderer && <Terrain
                      renderer={this.state.renderer}
                      scene={this.state.scene}
                      width={512}
                      height={512}
                      detail={512}
                      amplitude={150}
                    />
                  }
                </GUI>
                <div id="SKETCHCONTAINER">
                  <div id="APP" ref={mount => { this.mount = mount }} />
                </div>
              </div>
            </Provider>
          </SketchProvider>
        </MuiThemeProvider>
      </HashRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
