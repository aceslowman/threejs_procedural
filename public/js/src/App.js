import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

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

ReactDOM.render(
  <Provider store={store}>
    <div className="container">
      <GUI />
      <Sketch />
    </div>
  </Provider>,
  document.getElementById('root')
);
