import { combineReducers } from 'redux';
import cameras from './CameraReducer';
import { maps, passes, terrain } from './TerrainReducer';

export default combineReducers({maps, passes, cameras, terrain});
