const initial = {
    byId: {},
    allIds: []
}

export default function cameras(state = initial, action){
    switch (action.type) {
        case 'ADD_CAMERA':
            return ({
                byId: {
                    ...state.byId,
                    [action.camera.id]: action.camera
                },
                allIds: [...state.allIds, action.camera.id]
            });

        case 'UPDATE_CAMERA':
            return ({
                byId: {
                    ...state.byId,
                    [action.cameraId]: {
                        ...state.byId[action.cameraId],
                        [action.param]: action.value
                    }
                }
            });             
             
        default:
            return state
    }
}