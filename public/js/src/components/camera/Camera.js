import * as THREE from 'three';

import OrbitControls from "../../utilities/OrbitControls.js";

export default class Camera {
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.width = width;
        this.height = height;

        this.initialize();
    }

    initialize() {
        /* here, I can create several cameras and immediately send them to 
    state as serialized objects. then, I could just worry about 
    maintaining an 'active' camera at any given time. */
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
            75,            // fov
            this.width / this.height,   // aspect
            0.01,          // near
            2000           // far
        );
        perspective.name = "Default Perspective";
        perspective.zoom = 2;
        perspective.position.z = 999;
        perspective.up.set(0, 0, 1);
        perspective.updateProjectionMatrix();
        perspective.updateMatrixWorld();

        // TODO: currently trying to figure out whether or not to
        // initialize in the reducer

        // send to store
        // this.props.addCamera(ortho);
        // this.props.addCamera(perspective);

        // set default camera
        this.camera = perspective;
        // this.props.setActiveCamera(perspective.uuid);

        this.setupOrbit();  
    }

    update(){
        /* There could be a performance boost here by only copying over the 
        parameters that have changed. Not sure how that works but maybe it's 
        a matter of doing some kind of diff. I am imagining that 
        loader.parse() could be a bottleneck. */

        // const loader = new THREE.ObjectLoader();
        // const obj = loader.parse(this.props.cameras.byId[uuid]);

        // this.camera = obj;
        // this.camera.updateProjectionMatrix();

        // this.camera.up.set(0, 0, 1);

        // this.orbitControls.object = this.camera;
        // this.orbitControls.update(); 
    }

    setupOrbit() {
        this.orbitControls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        // this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.8;
        // this.orbitControls.panningMode = THREE.HorizontalPanning; // default is THREE.ScreenSpacePanning
        this.orbitControls.minDistance = 0.1;
        this.orbitControls.maxDistance = 1000;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        // this.orbitControls.autoRotate = true;

        // this.props.addOrbit(this.orbitControls);        
    }

    getCamera(){
        return this.camera;
    }
}