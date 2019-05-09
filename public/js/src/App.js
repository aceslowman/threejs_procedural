import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import SketchContainer from './components/Sketch/SketchContainer';
// import { reducer } from './reducers/reducer';
import reducer from './reducer'; //TODO: working on simplifying reducer structure

import devToolsEnhancer from 'remote-redux-devtools';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <SketchContainer />
  </Provider>,
  document.getElementById('root')
);
