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
                    [action.camera.object.name]: action.camera.object
                },
                allIds: [...state.allIds, action.camera.object.name]
            });

        case 'UPDATE_CAMERA':
            console.group();
            console.log('id', action.cameraId);
            console.log('param', action.param);
            console.log('val', action.value);
            console.groupEnd();
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
             
        default:
            return state
    }
}