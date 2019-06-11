import { connect } from 'react-redux';
import Terrain from './Terrain';

import { updateTerrain } from '../../redux/actions/terrain';
import { addMap } from '../../redux/actions/maps';

import { 
  updatePassParam, 
  updatePassDefine, 
  updatePassUniform 
} from '../../redux/actions/passes';

import { 
  selectPass,
  updateDiagramActiveMap, 
  updateDiagramActivePass 
} from '../../redux/actions/diagrams';

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
    dispatch(selectPass(passId));
  },
  addMap: (map, name) => {
    dispatch(addMap(map, name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terrain);
