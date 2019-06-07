import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import Sketch from './components/sketch/SketchContainer';
import GUI from './components/gui/GUI';
import Diagram from './components/diagram/DiagramContainer';

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

    this.state = {
      sketchReady: false
    }
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
              {/* {this.state.sketchReady && <GUI /> } */}
              <GUI ready={this.state.sketchReady}/>
              <div id="SKETCHCONTAINER">
                <Sketch onReady={() => this.handleSketchReady()} />
                {this.state.sketchReady && <Diagram />}
              </div>
            </div>
          </Provider>
        </MuiThemeProvider>
      </HashRouter>)
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
