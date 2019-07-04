export default function renderer(state = {}, action) {
    switch (action.type) {
        case 'CHANGE_RENDERER':
            return ({
                ...state,
                renderer: action.renderer
            });

        default:
            return state
    }
}