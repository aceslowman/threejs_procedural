export const changeRenderer = (renderer) => {
    return ({
        type: 'CHANGE_RENDERER',
        renderer: renderer
    });
}