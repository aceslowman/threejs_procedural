import { connect } from 'react-redux';
//import actions
import MapGUI from '../components/gui/MapGUI';

// send some sort of message along to the store, to be utilized by the reducer.
const guiChanged = (id, key, value) => {
  console.log('value', value)

  return ({
    type: 'UPDATE_MAP',
    key: key,
    value, value
  });
};

const guiAdd = (name) => ({
  type: 'GUI_ADDED',
  name: name
})

const mapStateToProps = state => ({
  maps: state.maps
});

const mapDispatchToProps = dispatch => ({
  guiChanged: (id, key, value) => {
    dispatch(guiChanged(id, key, value)); // send action containing the key and value
  },
  guiAdd: (name) => {
    dispatch(guiAdd(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapGUI);
