import { connect } from 'react-redux';
//import actions
import MapGUI from './MapGUI';

// send some sort of message along to the store, to be utilized by the reducer.
const updatePassDefine = (pId, dId, val) => {
  return ({
    type: 'UPDATE_PASS_DEFINE',
    passId: pId,
    defineId: dId,
    value: val
  });
};

const updatePassUniform = (pId, uId, val) => {
  return ({
    type: 'UPDATE_PASS_UNIFORM',
    passId: pId,
    uniformId: uId,
    value: val
  });
};

// the documentation states that mapStateToProps should RESHAPE the state data.
// currently this is returning everything I believe I will need.
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapGUI);
