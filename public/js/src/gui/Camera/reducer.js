import * as THREE from 'three';

const initial = {
    active: '',
    byId: {},
    byType: {},
    allIds: []
}

export default function cameras(state = initial, action){
    switch (action.type) {
        case 'ADD_CAMERA':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.camera.object.uuid]: {
                        ...action.camera,
                    }
                },
                byType: {
                    ...state.byType,
                    [action.camera.object.type]: action.camera.object.uuid
                },
                allIds: [...state.allIds, action.camera.object.uuid]
            });

        case 'UPDATE_CAMERA':
            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [action.cameraId]: {
                        ...state.byId[action.cameraId],
                        object: {
                            ...state.byId[action.cameraId].object,
                            [action.param]: action.value
                        }
                    }
                }
            });   

        case 'ACTIVATE_CAMERA':
            let uuid = action.uuid ? action.uuid : state.byType[action.cameraType];

            return ({
                ...state,
                active: uuid
            });
            
        case 'CHANGE_VIEW':
            const loader = new THREE.ObjectLoader();
            const obj = loader.parse(state.byId[state.active]);

            obj.up.set(0,0,1);
            
            switch (action.view){
                case 'SIDE':
                    obj.position.set(1100,0,0);
                    obj.lookAt(0,0,0);
                    break;
                case 'TOP':
                    obj.position.set(0,0,1000);
                    obj.lookAt(0,0,0);
                    break;
                case 'ANGLE':
                    obj.position.set(600,600,600);
                    obj.lookAt(0,0,0);
                    break;
            }

            obj.updateMatrixWorld();

            const serialized = obj.toJSON();

            return ({
                ...state,
                byId: {
                    ...state.byId,
                    [serialized.object.uuid]: serialized,
                }
            });  

        case 'ADD_ORBITCONTROLS':
            return ({
                ...state,
                orbitControls: action.serialized
            });

        default:
            return state
    }
}