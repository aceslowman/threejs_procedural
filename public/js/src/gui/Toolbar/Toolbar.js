import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import { toolbar_style } from './style';

import MapGUIContainer from '../MapGUI/MapGUIContainer';
import CameraGUIContainer from '../CameraGUI/CameraGUIContainer';
import TerrainGUIContainer from '../TerrainGUI/TerrainGUIContainer';

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
          <div id="NAV">
            <h1 style={this.style.h1}>Procedural Tools</h1>
            <nav style={this.style.nav}>
              <ul>
                <li>
                  <Link to="/">🏠</Link>
                </li>
                <li>
                  <Link to="/terrain/">⛰</Link>
                </li>
                <li>
                  <Link to="/maps/">🗺</Link>
                </li>
                <li>
                  <Link to="/camera/">📷</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div id="DATGUI">
            <Route path="/" exact component={MapGUIContainer} />
            <Route path="/camera/" exact component={CameraGUIContainer} />
            <Route path="/maps/" exact component={MapGUIContainer} />
            <Route path="/terrain/" exact component={TerrainGUIContainer} />
          </div>
          <div id="TOOLBAR_HANDLE" style={this.style.handle}></div>
        </div>
      </HashRouter>
    );
  }
}
