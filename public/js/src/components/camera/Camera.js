import * as THREE from 'three';

import OrbitControls from "../../utilities/OrbitControls.js";

import { addCamera, setActiveCamera, addOrbit, changeView } from '../../redux/actions/cameras';
import store, { observeStore } from '../../redux/store';
import { getCameras, getActiveCamera } from '../../redux/selectors'; 

export default class Camera {
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.width    = width;
        this.height   = height;

        this.initialize();

        observeStore(store, getActiveCamera, (cam)=>this.updateActiveCamera(cam));
    }

    initialize() {
        /*  
            TODO: currently trying to figure out whether or not to
            initialize in the reducer 
         */

        let ortho = new THREE.OrthographicCamera(
            this.width / - 2,
            this.width / 2,
            this.height / 2,
            this.height / - 2,
            0,
            2000
        );
        
        ortho.name = "Default Orthographic";
        ortho.zoom = 2;
        ortho.position.z = 999;
        ortho.up.set(0, 0, 1);
        ortho.updateProjectionMatrix();
        ortho.updateMatrixWorld();

        let perspective = new THREE.PerspectiveCamera(
            75,                         // fov
            this.width / this.height,   // aspect
            0.01,                       // near
            2000                        // far
        );
        
        perspective.name = "Default Perspective";
        perspective.zoom = 2;
        perspective.position.z = 999;
        perspective.up.set(0, 0, 1);
        perspective.updateProjectionMatrix();
        perspective.updateMatrixWorld();

        this.camera = perspective;

        this.setupOrbit();  

        // TODO: is there a better place for this?
        store.dispatch(addCamera(ortho));
        store.dispatch(addCamera(perspective));
        store.dispatch(setActiveCamera(perspective.uuid));
        store.dispatch(changeView('ANGLE')); // set default view!
    }

    updateActiveCamera(cam){
        /* There could be a performance boost here by only copying over the 
        parameters that have changed. Not sure how that works but maybe it's 
        a matter of doing some kind of diff. I am imagining that 
        loader.parse() could be a bottleneck. */

        const loader = new THREE.ObjectLoader();
        const obj = loader.parse(cam);

        this.camera = obj;
        this.camera.updateProjectionMatrix();

        this.camera.up.set(0, 0, 1);

        this.orbitControls.object = this.camera;
        this.orbitControls.update(); 
    }

    setupOrbit() {
        this.orbitControls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.orbitControls.dampingFactor = 0.8;
        this.orbitControls.minDistance = 0.1;
        this.orbitControls.maxDistance = 1000;
        this.orbitControls.maxPolarAngle = Math.PI / 2;

        store.dispatch(addOrbit(this.orbitControls));        
    }

    getCamera(){
        return this.camera;
    }
}