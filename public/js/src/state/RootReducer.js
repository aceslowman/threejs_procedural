import { combineReducers } from 'redux';
import cameras from '../gui/Camera/reducer';
import { maps, passes, terrain } from '../gui/Terrain/reducer';

export default combineReducers({maps, passes, cameras, terrain});
