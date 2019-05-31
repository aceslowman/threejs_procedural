import { createStore, applyMiddleware } from 'redux';
import RootReducer from './reducers/RootReducer';

// middleware
import throttledMiddleware from './middleware/throttled';

const middlewares = [throttledMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, composeEnhancers(
    applyMiddleware(...middlewares)
));

export default store;