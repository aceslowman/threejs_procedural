import { connect } from 'react-redux';
import Sketch from './Sketch';

// TERRAIN ---------------------------------
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

//CAMERAS------------------------------------
const addCamera = (camera) => {
    return ({
        type: 'ADD_CAMERA',
        camera: {
            ...camera.toJSON(),
            focalLength: camera.type == 'PerspectiveCamera' ? camera.getFocalLength() : 0
        }
    });
}

const setActiveCamera = (camera) => {
    return ({
        type: 'ACTIVATE_CAMERA',
        cameraId: camera.uuid,
        meta: {
            throttle: 40
        }
    });
};

//REACTREDUXCONFIG---------------------------------
const mapStateToProps = state => {
    const { maps, passes, cameras, terrain } = state;

    return {
        maps:    maps.byId,     //TODO: remove byId
        passes:  passes.byId,   //TODO: remove byId
        cameras: cameras,
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
    addCamera: (camera) => {
        dispatch(addCamera(camera))
    },
    setActiveCamera: (camera) => {
        dispatch(setActiveCamera(camera))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sketch);
