import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import SketchContainer from './components/Sketch/SketchContainer';
import reducer from './reducer';

// middleware
import throttledMiddleware from './middleware/throttled';

const middlewares = [throttledMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(...middlewares)
));

ReactDOM.render(
  <Provider store={store}>
    <SketchContainer />
  </Provider>,
  document.getElementById('root')
);
