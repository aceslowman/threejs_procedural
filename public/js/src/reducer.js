import { combineReducers } from 'redux';
import maps from './components/MapGUI/MapsReducer';
import passes from './components/MapGUI/PassesReducer';
import cameras from './components/CameraGUI/CamerasReducer';
import terrain from './components/TerrainGUI/TerrainReducer';

export default combineReducers({maps, passes, cameras, terrain});
