import { connect } from 'react-redux';
import Renderer from './Renderer';

import { changeRenderer } from '../../redux/actions/renderer';

const mapStateToProps = state => {
    const { renderer } = state;
    return ({
        renderer: renderer
    })
};

const mapDispatchToProps = dispatch => ({
    changeRenderer: (r) => {
        dispatch(changeRenderer(r));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Renderer);