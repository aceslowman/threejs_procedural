import { connect } from 'react-redux';
import TerrainTools from './TerrainTools';

const updateTerrain = (param, val) => {
  return ({
    type: 'UPDATE_TERRAIN',
    param: param,
    value: val,
    meta: {
      throttle: 40
    }
  });
}

const mapStateToProps = state => {
  const { terrain } = state;

  return ({
    terrain: terrain
  })
};

const mapDispatchToProps = dispatch => ({
  updateTerrain: (pId, dId, val) => {
    dispatch(updateTerrain(pId, dId, val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerrainTools);
