export function addTerrain(terrain){
    return ({
        type: 'ADD_TERRAIN',
        terrain: {
            ...terrain,
            elevation: terrain.elevation.target.texture.uuid
        }
    });
};

export const updateTerrain = (param, val) => {
    return ({
        type: 'UPDATE_TERRAIN',
        param: param,
        value: val,
        meta: {
            throttle: 40
        }
    });
}