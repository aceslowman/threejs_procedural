const initial = {
    width: '',
    height: '',
    detail: '',
    amplitude: '',
    elevation: ''
}

const terrain = (state = initial, action) => {
    switch (action.type) {
        case 'ADD_TERRAIN':
            return ({
                ...state,
                width: action.terrain.width,
                height: action.terrain.height,
                detail: action.terrain.detail,
                amplitude: action.terrain.amplitude,
                elevation: action.terrain.elevation,
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
            // TODO: I will need to generate some sort of UNIQUE id for each pass, appending to the end of the sanitized name.
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
            // TODO: I will need to generate some sort of UNIQUE id for each pass, appending to the end of the sanitized name.
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
            // TODO: I will need to generate some sort of UNIQUE id for each pass, appending to the end of the sanitized name.
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