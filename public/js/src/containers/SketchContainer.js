import { connect } from 'react-redux';
//import actions
import Sketch from '../components/Sketch';

// send an action
const mapAdded = (id, map) => {
    let d_map = {
        id: id,
        passes: map.composer.passes.map(a=>a.material.name)
    };

    let d_passes = map.composer.passes.map(a=>({
        id: a.material.name,
        defines: a.material.defines,
        uniforms: a.material.uniforms
    }));

    return ({
        type: 'ADD_MAP',
        map: d_map,
        passes: d_passes
    });
};

const mapStateToProps = state => {
    const { maps, passes } = state;

    return {
        maps: maps.byId,
        passes: passes.byId
    }
};

const mapDispatchToProps = dispatch => ({
    mapAdded: (id, map) => {
        dispatch(mapAdded(id, map)) // send action containing the key and value
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);
