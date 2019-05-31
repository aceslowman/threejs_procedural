const initial_terrain = {
    width: 512,
    height: 512,
    detail: 512,
    amplitude: 100,
    random_seed: Math.random() * 10000
};

const terrain = (state = initial_terrain, action) => {
    switch (action.type) {
        case 'ADD_MAP':
            return ({
                ...state,
                [action.map.name]: action.map.id
            })
        case 'ADD_TERRAIN':
            return ({
                ...state,
                width: action.terrain.width,
                height: action.terrain.height,
                detail: action.terrain.detail,
            });     

        case 'UPDATE_TERRAIN':
            return ({
                ...state,
                ...action.terrain,
                [action.param]: action.value
            });

        default:
            return state;
    }
}

const maps = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'ADD_MAP':
            return ({
                byId: {
                    ...state.byId,
                    [action.map.id]: action.map
                },
                allIds: [...state.allIds, action.map.id]
            })
        default:
            return state;
    }
}

//-------------------------------------------------------------------------

const passes = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'ADD_MAP':
            let passes = {};

            for (let pass in action.passes) {
                passes[action.passes[pass].id] = action.passes[pass]
            }

            return ({
                ...state,
                byId: {
                    ...state.byId,
                    ...passes
                },
                allIds: [...state.allIds, ...action.passes.map(a => a.id)]
            })
        case 'UPDATE_PASS_DEFINE':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.passId]: {
                        ...state.byId[action.passId],
                        defines: {
                            ...state.byId[action.passId].defines,
                            [action.defineId]: action.value
                        }
                    }
                }
            });

        case 'UPDATE_PASS_UNIFORM':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.passId]: {
                        ...state.byId[action.passId],
                        uniforms: {
                            ...state.byId[action.passId].uniforms,
                            [action.uniformId]: {
                                value: action.value
                            }
                        }
                    }
                }
            });

        case 'UPDATE_PASS_PARAM':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.passId]: {
                        ...state.byId[action.passId],
                        params: {
                            ...state.byId[action.passId].params,
                            [action.param]: action.value
                        }
                    }
                }
            });

        default:
            return state;
    }
}

export { terrain, maps, passes };