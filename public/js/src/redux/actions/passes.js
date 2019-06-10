export const updatePassParam = (pId, param, val) => {
    return ({
        type: 'UPDATE_PASS_PARAM',
        passId: pId,
        param: param,
        value: val,
        meta: {
            throttle: 40
        }
    });
}

export const updatePassDefine = (pId, dId, val) => {
    return ({
        type: 'UPDATE_PASS_DEFINE',
        passId: pId,
        defineId: dId,
        value: val,
        meta: {
            throttle: 40
        }
    });
};

export const updatePassUniform = (pId, uId, val) => {
    return ({
        type: 'UPDATE_PASS_UNIFORM',
        passId: pId,
        uniformId: uId,
        value: val,
        meta: {
            throttle: 40
        }
    });
};