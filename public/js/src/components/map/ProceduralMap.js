import React from 'react';
import * as THREE from 'three';

// import { EffectComposer } from '../../utilities/EffectComposer/EffectComposer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export default class ProceduralMap extends React.Component {
    constructor(props){
        super(props);

        if(!props.children) console.error("no passes have been defined for map! make sure that valid passes have been provided as prop children.");

        this.passes   = props.children;
        this.renderer = props.renderer;
        this.width    = props.width  || 256;
        this.height   = props.height || 256;
        this.seed     = props.seed || Math.random() * 10000;
        this.name     = props.name || "default map";

        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearMipMapLinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,       // important for readPixels()
            type: THREE.FloatType,          // important for readPixels()
            stencilBuffer: false
        });

        this.composer = new EffectComposer(this.renderer, this.target);
        this.composer.setSize(this.width, this.height);

        this.composer.swapBuffers(); // fixes issue where composer does not init

        this.state = {
            passes: this.passes
        };

        props.onRef(this);
    }

    updateComposer(){
        // when there is one buffer present, swapBuffers() is necessary
        // when there are two, swap. I need to know how this works though.
        if(this.composer.passes.length == 0) this.composer.swapBuffers();
        this.composer.render();

        this.props.displaceGeometry();
    }

    updatePassParam(pass_id, name, value) {
        this.composer.passes[pass_id][name] = value;
        this.updateComposer();
    }

    updatePassDefine(pass_id, name, value) {
        this.composer.passes[pass_id].material.defines[name] = value;
        this.composer.passes[pass_id].material.needsUpdate = true; // necessary when updating defines
        this.updateComposer();
    }

    updatePassUniform(pass_id, name, value) {
        this.composer.passes[pass_id].uniforms[name].value = value;
        this.updateComposer();
    }

    addPass(pass) {
        console.log('hit');
        let shaderPass = new ShaderPass(pass);
        shaderPass.enabled = true;

        this.composer.addPass(shaderPass);
        this.composer.render();

        this.props.displaceGeometry();
    }

    getSample(x, y) {
        const buffer = new Float32Array(4); // NOTE: can't use floats in Safari!
        if (x > this.width || y > this.height || x < 0 || y < 0) console.warn("sampling out of bounds")
        this.renderer.readRenderTargetPixels(this.target, x, y, 1, 1, buffer);
        return buffer[0];
    }

    getBufferArray() {
        const buffer = new Float32Array(this.width * this.height * 4); // NOTE: can't use floats in Safari!
        this.renderer.readRenderTargetPixels(this.target, 0, 0, this.width, this.height, buffer);
        return buffer;
    }

    render() {
        return(
            <React.Fragment>
                {React.Children.map(this.passes, (child, i) => React.cloneElement(child, {
                    index:i,
                    updatePassParam: (p,n,v) => this.updatePassParam(p,n,v),     // pass the update props on to the
                    updatePassDefine: (p,n,v) => this.updatePassDefine(p,n,v),   // props.children
                    updatePassUniform: (p,n,v) => this.updatePassUniform(p,n,v), 
                    addPass: (p) => this.addPass(p),
                    composer: this.composer, 
                    octaves: 8, 
                    seed: this.seed
                }))}
            </React.Fragment>
        )
    }
};