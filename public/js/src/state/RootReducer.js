import { combineReducers } from 'redux';
import { maps, passes } from '../gui/MapGUI/reducer';
import cameras from '../gui/CameraGUI/reducer';
import terrain from '../gui/TerrainGUI/reducer';

export default combineReducers({maps, passes, cameras, terrain});
