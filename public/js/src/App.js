import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import SketchContainer from './sketch/SketchContainer';
import RootReducer from './state/RootReducer';

// middleware
import throttledMiddleware from './state/middleware/throttled';

const middlewares = [throttledMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, composeEnhancers(
  applyMiddleware(...middlewares)
));

ReactDOM.render(
  <Provider store={store}>
    <SketchContainer />
  </Provider>,
  document.getElementById('root')
);
