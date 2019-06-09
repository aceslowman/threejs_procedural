export const selectPass = passId => {
    return ({
        type: 'SET_ACTIVE_PASS',
        id: passId
    });
}