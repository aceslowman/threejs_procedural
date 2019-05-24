const initial = {
    active: '',
    byId: {},
    allIds: []
}

export default function cameras(state = initial, action){
    switch (action.type) {
        case 'ADD_CAMERA':
            return ({
                byId: {
                    ...state.byId,
                    [action.camera.object.name]: {
                        ...action.camera.object,
                        focalLength: action.camera.focalLength
                    }
                },
                allIds: [...state.allIds, action.camera.object.name]
            });

        case 'UPDATE_CAMERA':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.cameraId]: {
                        ...state.byId[action.cameraId],
                        [action.param]: action.value
                    }
                }
            });   

        case 'ACTIVATE_CAMERA':
            return ({
                ...state,
                active: action.cameraId
            });
            
        case 'CHANGE_VIEW':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [state.active]: {
                        ...state.byId[state.active],
                    }
                }
            });  

        default:
            return state
    }
}