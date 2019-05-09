import { combineReducers } from 'redux';
import maps from './maps';
import cameras from './cameras';
import passes from './passes';

export default combineReducers({maps, passes, cameras});
