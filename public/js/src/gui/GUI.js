import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import { toolbar_style } from './style';

import CameraContainer from './Camera/CameraContainer';
import TerrainContainer from './Terrain/TerrainContainer';
// TODO: FILL IN THE REST WHEN THE DESIGN IS FINALIZED

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      maps: props.maps
    };

    this.dragOffset = 0;

    this.style = toolbar_style;

    this.handle = {
      elem: '',
      active: false
    };

    this.toolbar = {
      elem: ''
    }
  }

  componentDidMount() {
    this.handle.elem  = document.getElementById('TOOLBAR_HANDLE');
    this.toolbar.elem = document.getElementById('TOOLBAR');

    this.handle.elem.addEventListener("touchstart", (e)=>this.dragStart(e), false);
    this.handle.elem.addEventListener("touchend", (e)=>this.dragEnd(e), false);
    document.addEventListener("touchmove", (e)=>this.drag(e), false);
    this.handle.elem.addEventListener("mousedown", (e)=>this.dragStart(e), false);
    document.addEventListener("mouseup", (e)=>this.dragEnd(e), false);
    document.addEventListener("mousemove", (e)=>this.drag(e), false);

    this.handle.elem.addEventListener("dblclick", (e)=>this.togglePanel(e), false);
  }

  /* 
    TODO: this is still somewhat wonky, but better than it was. proper offset isn't
          being calculated.
  */

  dragStart(e) {
    console.log('dragStart');
    this.dragOffset = this.toolbar.elem.offsetWidth - e.clientX;

    this.toolbar.elem.style.transition = 'none';
    if (e.target === this.handle.elem) this.handle.active = true;
    
    this.toolbar.elem.style.width = e.clientX + this.dragOffset + 'px';
  }

  dragEnd(e) {
    console.log('dragEnd');
    this.handle.active = false;
  }

  drag(e) {
    if (this.handle.active) {
      e.preventDefault();
      console.log('drag');

      let clientX;

      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      // let offset = this.toolbar.elem.offsetWidth - clientX;
      // this.dragOffset = 15;
      
      this.toolbar.elem.style.width = clientX + this.dragOffset + 'px';
    }
  }

  togglePanel(e) {
    if(this.state.open){
      this.toolbar.elem.style.transition = 'width 1000ms ease';
      this.toolbar.elem.style.width = '100px';
      document.getElementById('DATGUI').style.opacity = '0';
      this.setState({open: false});
    }else{
      this.toolbar.elem.style.transition = 'width 1000ms ease';
      this.toolbar.elem.style.width = '330px';
      setInterval(()=>document.getElementById('DATGUI').style.opacity = '1', 500);
      this.setState({open: true});
    }
  };

  render() {
    return (
      <HashRouter>
        <div id="TOOLBAR" style={this.style.toolbar}>
          <h1 id="title">Procedural Tools</h1>
          <div id="navigation">
            <nav style={this.style.nav}>
              <ul>
                <li>
                  <Link to="/terrain/">⛰</Link>
                </li>
                <li>
                  <Link to="/flora/">🌿</Link>
                </li>
                <li>
                  <Link to="/fauna/">🐈</Link>
                </li>
                <li>
                  <Link to="/city/">🏙</Link>
                </li>
                <li>
                  <Link to="/camera/">📷</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div id="subwrapper">
            <Route path="/" exact component={TerrainContainer} />
            <Route path="/camera/" component={CameraContainer} />
            <Route path="/terrain/" component={TerrainContainer} />
          </div>
          <div id="TOOLBAR_HANDLE" style={this.style.handle}></div>
        </div>
      </HashRouter>
    );
  }
}
