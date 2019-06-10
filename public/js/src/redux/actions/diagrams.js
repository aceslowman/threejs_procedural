export const selectPass = passId => {
    return ({
        type: 'SET_ACTIVE_PASS',
        id: passId
    });
}

export const updateDiagramActiveMap = (map) => {
    return ({
        type: 'SET_ACTIVE_MAP',
        map: map
    });
}

export const updateDiagramActivePass = (pass) => {
    return ({
        type: 'SET_ACTIVE_PASS',
        pass: pass
    });
}