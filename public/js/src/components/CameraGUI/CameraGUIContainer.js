import { connect } from 'react-redux';
//import actions
import CameraGUI from './CameraGUI';

// send some sort of message along to the store, to be utilized by the reducer.
const updateCamera = (camId, param, val) => {
  return ({
    type: 'UPDATE_CAMERA',
    cameraId: camId,
    param: param,
    value: val
  });
};

const mapStateToProps = state => {
  const { cameras } = state;

  return ({
    cameras: cameras.byId
  })
};

const mapDispatchToProps = dispatch => ({
  updateCamera: (camId, param, val) => {
    dispatch(updateCamera(camId, param, val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraGUI);
