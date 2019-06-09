import { connect } from 'react-redux';
import Diagram from './Diagram';

import { selectPass } from '../../redux/actions/diagrams';

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
    selectPass: (passId) => {
        dispatch(selectPass(passId))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Diagram);
