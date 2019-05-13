const initial = {
    width: '',
    height: '',
    detail: '',
    amplitude: '',
    elevation: ''
}

export default function terrain(state = initial, action) {
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
