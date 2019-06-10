import * as THREE from 'three';

import ProceduralMap from '../../procedural/ProceduralMap';

import FractalNoise from "../../shaders/fractalnoise.js";
import FractalWarp from "../../shaders/fractalwarp.js";

import store, {observeStore} from '../../redux/store';
import {getTerrain, getPasses} from '../../redux/selectors'; 
import {addMap} from '../../redux/actions/maps';
import {addTerrain} from '../../redux/actions/terrain';
import watch from 'redux-watch';

import { diff } from 'deep-object-diff';

export default class Terrain {
    constructor(renderer, scene, options){
        this.renderer  = renderer;
        this.scene     = scene;

        this.width     = options.width;
        this.height    = options.height;
        this.detail    = options.detail;
        this.amplitude = options.amplitude;
        this.seed      = Math.random() * 10000;        

        this.verbose = false;

        this.initialize();

        store.dispatch(addTerrain(this));

        let watchPasses = watch(() => getPasses(store.getState()));
        store.subscribe(watchPasses(this.updatePasses));
    }

    updateTerrain(value){
        console.log('terrain changed', value);
    }

    updatePasses(newPasses, oldPasses) {
        console.log('newVal', newPasses);
        console.log('oldVal', oldPasses);

        let d = diff(oldPasses, newPasses);

        console.log('DIFF',d);
    }

    initializeElevation(){
        let map = new ProceduralMap(this.renderer, {
            width: this.width,
            height: this.height
        });

        let passes = [
            new FractalNoise(8, this.seed),
            new FractalWarp(4, this.seed)
        ];

        for (let pass of passes) {
            let p = new THREE.ShaderPass(pass.shaderMaterial);
            map.composer.addPass(p);
        }

        map.composer.swapBuffers();
        map.render();

        this.elevation = map;
        store.dispatch(addMap(map, 'Elevation'));
    }

    initializeColors(){
        let map = new ProceduralMap(this.renderer, {
            width: this.width,
            height: this.height
        });

        let passes = [
            new FractalNoise(8, this.seed),
            new FractalWarp(4, this.seed),
            // TODO: implement a lookup table shader!
        ];

        for (let pass of passes) {
            let p = new THREE.ShaderPass(pass.shaderMaterial);
            map.composer.addPass(p);
        }

        map.composer.swapBuffers();
        map.render();

        this.colors = map;
        store.dispatch(addMap(map, 'Colors'));
    }

    initializeMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(
            this.width,
            this.height,
            this.detail,
            this.detail
        );

        this.displaceGeometry();

        // this.material = new THREE.MeshBasicMaterial({
        //     map: this.colors.target,
        // });

        this.material = new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
    }

    initialize(){
        this.initializeElevation();
        this.initializeColors();
        this.initializeMesh();

        this.setupDebug();
    }

    update(){
        this.elevation.render();
    }

    setupDebug() {
        var helper = new THREE.Box3Helper(this.geometry.boundingBox, 0xffff00);
        this.scene.add(helper);
    }

    /**
    * Displace the buffer geometry using a given Map
    */
    displaceGeometry() {
        const displacement_buffer = this.elevation.getBufferArray();
        const positions = this.geometry.getAttribute('position').array;
        const uvs = this.geometry.getAttribute('uv').array;
        const count = this.geometry.getAttribute('position').count;

        for (let i = 0; i < count; i++) {
            const u = uvs[i * 2];
            const v = uvs[i * 2 + 1];
            const x = Math.floor(u * (this.elevation.width - 1.0));
            const y = Math.floor(v * (this.elevation.height - 1.0));
            const d_index = (y * this.elevation.height + x) * 4;
            let r = displacement_buffer[d_index];

            positions[i * 3 + 2] = (r * this.amplitude);

            if (!r) {
                // TODO: implement some sort of check that prevents this.
                console.warn('cannot find value in displacement buffer');
            }
        }

        this.geometry.getAttribute('position').needsUpdate = true;
        this.geometry.computeVertexNormals();
        this.geometry.computeFaceNormals();
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();

        this.geometry.translate(0, 0, -this.geometry.boundingBox.min.z);
    }

    /**
    * Checks to see if a given point is within bounds of the terrain.
    * @param {Vector2} a - the point to be checked
    * @returns {Boolean} true if within bounds, false if not
    */
    globalBoundsCheck(a) {
        let h_w = (this.width / 2);
        let h_h = (this.height / 2);

        if (a.x >= h_w || a.x <= -h_w || a.y >= h_h || a.y <= -h_h) {
            if (this.verbose) console.warn('endpoint was out of bounds', a);
            return false;
        }

        return true;
    }
}