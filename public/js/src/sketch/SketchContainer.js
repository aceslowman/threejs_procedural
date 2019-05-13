import { connect } from 'react-redux';
import Sketch from './Sketch';

const mapAdded = (id, map) => {
    let d_map = {
        id: id,
        passes: map.composer.passes.map(a=>a.material.name)
    };

    let d_passes = map.composer.passes.map(a=>({
        id: a.material.name,
        params: {
            'enabled': a.enabled,
            'renderToScreen': a.renderToScreen
        },
        defines: a.material.defines,
        uniforms: a.material.uniforms
    }));

    return ({
        type: 'ADD_MAP',
        map: d_map,
        passes: d_passes
    });
};

const terrainAdded = (terrain) => {
    return ({
        type: 'ADD_TERRAIN',
        terrain: {
            ...terrain,
            elevation: terrain.elevation.target.texture.uuid
        }
    });
}

const cameraAdded = (camera) => {
    // TODO: strip out only the necessary params.

    return ({
        type: 'ADD_CAMERA',
        camera: {
            'id': camera.name,
            'fov': camera.getFocalLength()
        }
    });
}

const mapStateToProps = state => {
    const { maps, passes, cameras, terrain } = state;

    return {
        maps: maps.byId,
        passes: passes.byId,
        cameras: cameras.byId,
        terrain: terrain
    }
};

const mapDispatchToProps = dispatch => ({
    mapAdded: (id, map) => {
        dispatch(mapAdded(id, map)) // send action containing the key and value
    },
    terrainAdded: (terrain) => {
        dispatch(terrainAdded(terrain))
    },
    cameraAdded: (camera) => {
        dispatch(cameraAdded(camera))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);
