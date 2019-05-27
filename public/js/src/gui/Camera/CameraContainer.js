import { connect } from 'react-redux';
import Camera from './Camera';

// send some sort of message along to the store, to be utilized by the reducer.
const updateCamera = (camId, param, val) => {
  return ({
    type: 'UPDATE_CAMERA',
    cameraId: camId,
    param: param,
    value: val,
    meta: {
      throttle: 40
    }
  });
};

const activateCamera = (camId) => {
  return ({
    type: 'ACTIVATE_CAMERA',
    cameraId: camId,
    meta: {
      throttle: 40
    }
  });
};

const changeView = (view) => {
  return ({
    type: 'CHANGE_VIEW',
    view: view
  });
};

//-----------------------------------------------------------------------

const mapStateToProps = state => {
  const { cameras } = state;

  return ({
    cameras: cameras.byId,
    active: cameras.byId[cameras.active]
  })
};

const mapDispatchToProps = dispatch => ({
  updateCamera: (camId, param, val) => {
    dispatch(updateCamera(camId, param, val));
  },
  activateCamera: (camId) => {
    dispatch(activateCamera(camId));
  },
  changeView: (type) => {
    dispatch(changeView(type));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);
