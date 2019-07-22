import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import GUI from './components/GUI';
import Diagram from './components/diagram/DiagramContainer';

import * as THREE from 'three';

import Camera from './components/camera/Camera';
import Renderer from './components/renderer/RendererContainer';
import Physics from './components/physics/Physics';
import World from './components/world/World';

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
      physics: '',
      seed: Math.random() * 10000
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

    // TODO: move to utilities class
    let gridHelper = new THREE.GridHelper(2000, 200, new THREE.Color('yellow'));
    this.state.scene.add(gridHelper);
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
      scene: this.state.scene,
      seed: this.state.seed,
      physics: this.state.physics,
    }

    return (
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <SketchProvider value={sketchCtx}>
            <Provider store={store}>
              <div className="container">
                <GUI ready={this.state.sketchReady}>
                  <Physics 
                    key='Physics'
                    onRef={ref => this.setState({ physics: ref })}
                  /> 

                  <Renderer
                    key='Renderer'
                    width={this.state.width}
                    height={this.state.height}
                    camera={this.state.camera}
                    onRef={ref => this.setState({ renderer: ref })}
                  />
                  {
                    this.state.renderer && <Camera
                      key='Camera'
                      width={this.state.width}
                      height={this.state.height}
                      onRef={ref => this.setState({ camera: ref })}
                    />
                  }
                  {
                    this.state.renderer && <World
                      key='World'
                      width={512}
                      height={512}
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
