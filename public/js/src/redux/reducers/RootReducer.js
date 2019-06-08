import { combineReducers } from 'redux';
import cameras from './CameraReducer';
import { maps, passes, terrain } from './TerrainReducer';
import diagrams from './DiagramReducer';

export default combineReducers({maps, passes, cameras, terrain, diagrams});
