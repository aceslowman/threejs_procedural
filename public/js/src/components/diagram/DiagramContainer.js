import { connect } from 'react-redux';
import Diagram from './Diagram';

//REACTREDUXCONFIG---------------------------------
const mapStateToProps = state => {
    const { maps, passes } = state;

    return {
        maps:    maps,   
        passes:  passes
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
