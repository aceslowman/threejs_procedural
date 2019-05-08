import { connect } from 'react-redux';
//import actions
import MapGUI from '../components/gui/MapGUI';

// send some sort of message along to the store, to be utilized by the reducer.
const updatePassDefine = (map, key, val) => {
  console.log('CHECK', [map, key, val]);
  return ({
    type: 'UPDATE_PASS_DEFINE',
    key: key,
    value,val
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
  updatePassDefine: (id, key, value) => {
    dispatch(updatePassDefine(id, key, value)); // send action containing the key and value
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapGUI);
