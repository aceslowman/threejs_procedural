const initial = {
    activeMap: '',
    activePass: ''
}

export default function diagrams(state = initial, action) {
    switch (action.type) {
        case 'SET_ACTIVE_MAP':
            return ({
                ...state,
                activeMap: action.map.id
            });
        case 'SET_ACTIVE_PASS':
            return ({
                ...state,
                activePass: action.id
            });
        default:
            return state
    }
}