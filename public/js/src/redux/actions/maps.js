const uuidv4 = require('uuid/v4');

export function addMap(map, name){
    let d_passes = map.composer.passes.map(a => ({
        id: uuidv4(),
        name: a.material.name,
        params: {
            'enabled': a.enabled,
            'renderToScreen': a.renderToScreen
        },
        defines: a.material.defines,
        uniforms: a.material.uniforms
    }));

    let d_map = {
        id: uuidv4(),
        name: name,
        passes: d_passes.map(a => a.id)
    };

    return ({
        type: 'ADD_MAP',
        map: d_map,
        passes: d_passes
    });
};