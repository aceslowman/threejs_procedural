import { combineReducers } from 'redux';
import maps from './components/MapGUI/MapsReducer';
import passes from './components/MapGUI/PassesReducer';
import cameras from './components/CameraGUI/CamerasReducer';

export default combineReducers({maps, passes, cameras});
