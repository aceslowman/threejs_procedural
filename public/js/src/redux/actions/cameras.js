export function changeView(view){
    return ({
        type: 'CHANGE_VIEW',
        view: view
    });
};

export function addCamera(camera){
    return ({
        type: 'ADD_CAMERA',
        camera: {
            ...camera.toJSON(),
            focalLength: camera.type == 'PerspectiveCamera' ? camera.getFocalLength() : 0
        }
    });
}

export function setActiveCamera(uuid){
    return ({
        type: 'ACTIVATE_CAMERA',
        uuid: uuid,
        meta: {
            throttle: 40
        }
    });
};

export function addOrbit(orbit){
    const serialized = {
        autoRotate: orbit.autoRotate,
        enableDamping: orbit.enableDamping,
        dampingFactor: orbit.dampingFactor,
        minDistance: orbit.minDistance,
        maxDistance: orbit.maxDistance,
        panningMode: orbit.panningMode,
        maxPolarAngle: orbit.maxPolarAngle,
        autoRotate: orbit.autoRotate
    };

    return ({
        type: 'ADD_ORBITCONTROLS',
        serialized: serialized
    });
}