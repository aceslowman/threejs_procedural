const initial = {
    byId: {},
    allIds: []
}

export default function maps(state = initial, action) {
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