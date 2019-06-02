import { createStore, applyMiddleware } from 'redux';
import RootReducer from './reducers/RootReducer';

// middleware
import throttledMiddleware from './middleware/throttled';

const middlewares = [throttledMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, composeEnhancers(
    applyMiddleware(...middlewares)
));

/*
    observeStore is responsible for watching parameter changes.
    currently unsure on how to single out specific items though,
    needing to check.

    i am also unsure about whether or not this utility should be here.
*/
export function observeStore(store, select, onChange) {
    let currentState;

    function handleChange() {
        let nextState = select(store.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

export default store;