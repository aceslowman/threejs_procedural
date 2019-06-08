import { connect } from 'react-redux';
import Diagram from './Diagram';

//REACTREDUXCONFIG---------------------------------
const mapStateToProps = state => {
    const { maps, passes, diagrams } = state;

    return {
        maps:    maps,   
        passes:  passes,
        diagrams: diagrams,
        activeMap: maps.byId[diagrams.activeMap],
    }
};

const mapDispatchToProps = dispatch => ({
    // addCamera: (camera) => {
    //     dispatch(addCamera(camera))
    // },
    // setActiveCamera: (camera) => {
    //     dispatch(setActiveCamera(camera))
    // },
    // addOrbit: (orbit) => {
    //     dispatch(addOrbit(orbit))
    // }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Diagram);
