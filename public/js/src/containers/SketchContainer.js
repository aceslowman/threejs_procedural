import { connect } from 'react-redux';
//import actions
import Sketch from '../components/Sketch';

// send an action
const mapAdded = (id, map) => {
    // console.log('MAP', map)

    // here map should be deconstructed to match state.
    let d_map = {
        id: id,
        passes: map.composer.passes.map(a=>a.material.name)
    };
    // console.log("D_MAP", d_map);

    let d_passes = map.composer.passes.map(a=>({
        id: a.material.name,
        defines: a.material.defines,
        uniforms: a.material.uniforms
    }));
    // console.log("D_PASSES", d_passes);

    return ({
        type: 'ADD_MAP',
        map: d_map,
        passes: d_passes
    });
};

const mapStateToProps = state => ({
    number: state.value
});

const mapDispatchToProps = dispatch => ({
    mapAdded: (id, map) => {
        dispatch(mapAdded(id, map)) // send action containing the key and value
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);
