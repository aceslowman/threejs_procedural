import { connect } from 'react-redux';
import Camera from './Camera';
import {
  updateCamera,
  setActiveCamera,
  changeView,
  addOrbit,
  addCamera
} from '../../redux/actions/cameras';

//-----------------------------------------------------------------------

const mapStateToProps = state => {
  const { cameras } = state;

  return ({
    cameras: cameras,
    activeCamera: cameras.byId[cameras.active]
  })
};

const mapDispatchToProps = dispatch => ({
  updateCamera: (camId, param, val) => {
    dispatch(updateCamera(camId, param, val));
  },
  setActiveCamera: (camType) => {
    dispatch(setActiveCamera(camType));
  },
  changeView: (type) => {
    dispatch(changeView(type));
  },
  addOrbit: (orbit) => {
    dispatch(addOrbit(orbit));
  },
  addCamera: (cam) => {
    dispatch(addCamera(cam));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);
