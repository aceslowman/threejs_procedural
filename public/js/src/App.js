import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import GUI from './components/GUI';
import Diagram from './components/diagram/DiagramContainer';

import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky';

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


    var distance = 400000;
    let sky = new Sky();
    sky.scale.setScalar( 450000 );
    sky.updateMatrixWorld();

    var uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 2;
    uniforms["luminance"].value = 1;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;

    let sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(20000, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunSphere.position.x = - 700000;
    sunSphere.updateWorldMatrix();
    // sunSphere.visible = false;

    var theta = Math.PI * (0.49 - 0.5);
    var phi = 2 * Math.PI * (0.25 - 0.5);
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = true;
    uniforms["sunPosition"].value.copy(sunSphere.position);
  

    this.state.scene.add(sky);
    this.state.scene.add(sunSphere);

    // TODO: move to lighting class
    // var intensity = 70000; // raytracer apparently needs HIGH intensity
    let intensity = 0.5;

    var light = new THREE.PointLight(0xffaa55, intensity);
    light.position.set(- 200, 100, 100);
    light.physicalAttenuation = true;
    this.state.scene.add(light);

    // var light = new THREE.PointLight(0x55aaff, intensity);
    // light.position.set(200, 100, 100);
    // light.physicalAttenuation = true;
    // this.state.scene.add(light);

    // var light = new THREE.PointLight(0xffffff, intensity * 1.5);
    // light.position.set(0, 0, 300);
    // light.physicalAttenuation = true;
    // this.state.scene.add(light);

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
      seed: this.state.seed
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
                    onRef={ref => this.setState({ renderer: ref })}
                  />
                  {
                    this.state.renderer && <Camera
                      width={this.state.width}
                      height={this.state.height}
                      onRef={ref => this.setState({ camera: ref })}
                    />
                  }
                  {
                    this.state.renderer && <Terrain
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
