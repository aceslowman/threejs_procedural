import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import Sketch from './sketch/SketchContainer';
import GUI from './gui/GUI';
import RootReducer from './state/RootReducer';

// middleware
import throttledMiddleware from './state/middleware/throttled';

const middlewares = [throttledMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, composeEnhancers(
  applyMiddleware(...middlewares)
));

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
              {this.state.sketchReady && <GUI />}
              <Sketch onReady={() => this.handleSketchReady()} />
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
