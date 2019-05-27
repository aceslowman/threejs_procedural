// TEMP
import * as THREE from 'three';

const initial = {
    active: '',
    byId: {},
    allIds: []
}

export default function cameras(state = initial, action){
    switch (action.type) {
        case 'ADD_CAMERA':
            return ({
                byId: {
                    ...state.byId,
                    [action.camera.object.uuid]: {
                        ...action.camera,
                    }
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
                        [action.param]: action.value
                    }
                }
            });   

        case 'ACTIVATE_CAMERA':
            return ({
                ...state,
                active: action.cameraId
            });
            
        case 'CHANGE_VIEW':
            const loader = new THREE.ObjectLoader();
            const obj = loader.parse(state.byId[state.active]);
            
            switch (action.view){
                case 'SIDE':
                    obj.position.set(1,0,0);
                    obj.lookAt(0,0,0);
                    break;
                case 'TOP':
                    obj.position.set(0,0,-1);
                    obj.lookAt(0,0,0);
                    break;
                case 'ANGLE':
                    obj.position.set(-1,1,1);
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

        default:
            return state
    }
}