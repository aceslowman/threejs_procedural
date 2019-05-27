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

const activateCamera = (type) => {
  return ({
    type: 'ACTIVATE_CAMERA',
    cameraType: type,
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
  activateCamera: (camType) => {
    dispatch(activateCamera(camType));
  },
  changeView: (type) => {
    dispatch(changeView(type));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);
