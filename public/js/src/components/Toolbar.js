import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { toolbar_style } from './styles/toolbar';

import MapGUIContainer from '../containers/MapGUIContainer';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      maps: props.maps
    };
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
    this.handle.elem = document.getElementById('TOOLBAR_HANDLE');
    
    this.toolbar.elem = document.getElementById('TOOLBAR');
    this.toolbar.elem.addEventListener("touchstart", (e)=>this.dragStart(e), false);
    this.toolbar.elem.addEventListener("touchend", (e)=>this.dragEnd(e), false);
    this.toolbar.elem.addEventListener("touchmove", (e)=>this.drag(e), false);
    this.toolbar.elem.addEventListener("mousedown", (e)=>this.dragStart(e), false);
    this.toolbar.elem.addEventListener("mouseup", (e)=>this.dragEnd(e), false);
    this.toolbar.elem.addEventListener("mousemove", (e)=>this.drag(e), false);

    this.handle.elem.addEventListener("dblclick", (e)=>this.togglePanel(e), false);
  }

  dragStart(e) {
    this.toolbar.elem.style.transition = 'none';
    if (e.target === this.handle.elem) this.handle.active = true;
    this.toolbar.elem.style.width = e.clientX;
  }


  dragEnd(e) {
    this.handle.active = false;
  }

  drag(e) {
    if (this.handle.active) {
      e.preventDefault();

      let clientX;

      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      this.toolbar.elem.style.width = clientX + 'px';
    }
  }

  togglePanel(e) {
    if(this.state.open){
      this.toolbar.elem.style.transition = 'width 1000ms ease';
      this.toolbar.elem.style.width = '35px';
      document.getElementById('DATGUI').style.opacity = '0';
      this.setState({open: false});
    }else{
      this.toolbar.elem.style.transition = 'width 1000ms ease';
      this.toolbar.elem.style.width = '300px';
      setInterval(()=>document.getElementById('DATGUI').style.opacity = '1', 500);
      this.setState({open: true});
    }
  };

  render() {
    return (
      <Router>
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
              </ul>
            </nav>
          </div>
          <div id="DATGUI">
            <MapGUIContainer />
            {/* might be able to use routers */}
          </div>
          <div id="TOOLBAR_HANDLE" style={this.style.handle}></div>
        </div>
      </Router>
    );
  }
}
