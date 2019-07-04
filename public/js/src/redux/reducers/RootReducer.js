import { combineReducers } from 'redux';
import cameras from './CameraReducer';
import { maps, passes, terrain } from './TerrainReducer';
import diagrams from './DiagramReducer';
import renderer from './RendererReducer';

export default combineReducers({renderer});
