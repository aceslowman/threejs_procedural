import { connect } from 'react-redux';
import MapGUI from './MapGUI';

const updatePassParam = (pId, param, val) => {
  return ({
    type: 'UPDATE_PASS_PARAM',
    passId: pId,
    param: param,
    value: val,
    meta: {
      throttle: 40
    }
  });
}

const updatePassDefine = (pId, dId, val) => {
  return ({
    type: 'UPDATE_PASS_DEFINE',
    passId: pId,
    defineId: dId,
    value: val,
    meta: {
      throttle: 40
    }
  });
};

const updatePassUniform = (pId, uId, val) => {
  return ({
    type: 'UPDATE_PASS_UNIFORM',
    passId: pId,
    uniformId: uId,
    value: val,
    meta: {
      throttle: 40
    }
  });
};

const mapStateToProps = state => {
  const { maps } = state;
  const { passes } = state;

  return ({
    maps: maps.byId,
    passes: passes.byId
  })
};

const mapDispatchToProps = dispatch => ({
  updatePassDefine: (pId, dId, val) => {
    dispatch(updatePassDefine(pId, dId, val));
  },
  updatePassUniform: (pId, uId, val) => {
    dispatch(updatePassUniform(pId, uId, val));
  },
  updatePassParam: (pId, param, val) => {
    dispatch(updatePassParam(pId, param, val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapGUI);
