import { connect } from 'react-redux';
import Terrain from './Terrain';

import { selectPass } from '../../../redux/actions/diagrams';

// TODO: break up into terrain reducer

const updatePassParam = (pId, param, val) => {
  console.log([pId, param, val]);
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

const updateDiagramActiveMap = (map) => {
  return ({
    type: 'SET_ACTIVE_MAP',
    map: map
  });
}

const updateDiagramActivePass = (pass) => {
  return ({
    type: 'SET_ACTIVE_PASS',
    pass: pass
  });
}

const mapStateToProps = state => {
  const { terrain, maps, passes, diagrams } = state;
  return ({
    terrain: terrain,
    maps: maps.byId,
    passes: passes.byId,
    diagrams: diagrams
  })
};

const mapDispatchToProps = dispatch => ({
  updateTerrain: (pId, dId, val) => {
    dispatch(updateTerrain(pId, dId, val));
  },
  updatePassDefine: (pId, dId, val) => {
    dispatch(updatePassDefine(pId, dId, val));
  },
  updatePassUniform: (pId, uId, val) => {
    dispatch(updatePassUniform(pId, uId, val));
  },
  updatePassParam: (pId, param, val) => {
    dispatch(updatePassParam(pId, param, val));
  },
  updateDiagramActiveMap: (map) => {
    dispatch(updateDiagramActiveMap(map));
  },
  updateDiagramActivePass: (pass) => {
    dispatch(updateDiagramActivePass(pass));
  },
  selectPass: (passId) => {
    dispatch(selectPass(passId))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terrain);
