import { connect } from 'react-redux';
import Sketch from './Sketch';

//REACTREDUXCONFIG---------------------------------
const mapStateToProps = state => {
    const { maps, passes, cameras, terrain } = state;

    return {
        maps:    maps,   
        passes:  passes, 
        cameras: cameras,
        terrain: terrain
    }
};

const mapDispatchToProps = dispatch => ({
    addCamera: (camera) => {
        dispatch(addCamera(camera))
    },
    setActiveCamera: (camera) => {
        dispatch(setActiveCamera(camera))
    },
    addOrbit: (orbit) => {
        dispatch(addOrbit(orbit))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);
