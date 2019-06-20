import React from 'react';
import * as THREE from 'three';

import { EffectComposer } from '../../utilities/EffectComposer/EffectComposer.js';

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
            format: THREE.RGBAFormat, // important for readPixels()
            type: THREE.FloatType,    // important for readPixels()
            stencilBuffer: false
        });

        this.composer = new THREE.EffectComposer(this.renderer, this.target);
        this.composer.setSize(this.width, this.height);

        // for (let pass of this.passes) {
        //     // when each pass is mounted, it should add itself to the parent.
        //     let p = new THREE.ShaderPass(pass.shaderMaterial);
        //     this.composer.addPass(p);
        // }

        this.composer.swapBuffers();
        this.composer.render(); // TEMP

        this.state = {
            passes: this.passes
        };
    }

    handleMapSelect(map) {
        this.props.updateDiagramActiveMap(map)
    }

    // updatePassParam(map_id, pass_id, name, value) {
    //     // update parameter
    //     this.state.maps[map_id].composer.passes[pass_id][name] = value;
    //     this.updateMap(this.state.maps[map_id]);
    // }

    // updatePassDefine(map_id, pass_id, name, value) {
    //     console.log('updatePassDefine', [map_id, pass_id, name, value]);
    //     console.log(this.state.maps[map_id].composer.passes[pass_id][name]);

    //     // this.props.map.composer.passes[pass_id].defines
    // }

    // updatePassUniform(map_id, pass_id, name, value) {
    //     // update uniform
    //     this.state.maps[map_id].composer.passes[pass_id].uniforms[name].value = value;
    //     this.updateMap(this.state.maps[map_id]);
    // }

    updatePass(map_id, pass_id, name, value) {
        // update uniform
        this.state.maps[map_id].composer.passes[pass_id].uniforms[name].value = value;
        this.updateMap(this.state.maps[map_id]);
    }

    updateMap(map) {
        // update this specific map (i.e. Elevation or Color)
        map.render();
        // this is a big bottleneck, but likely unavoidable as long as I'm displacing on the CPU
        this.displaceGeometry();
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

    componentDidMount(){
        // this.props.displaceGeometry(this.getBufferArray(),this.width,this.height);
    }

    render() {
        return(
            <div>
                {React.Children.map(this.passes, child => React.cloneElement(child, [
                    {updatePassParam: (m,p,n,v)=>this.updatePassParam(m,p,n,v)},     // pass the update props on to the
                    {updatePassDefine: (m,p,n,v)=>this.updatePassDefine(m,p,n,v)},   // props.children
                    {updatePassUniform: (m,p,n,v)=>this.updatePassUniform(m,p,n,v)}, 
                    {composer: this.composer, octaves: '10', seed: this.seed}, 
                ]))}
            </div>
        )
    }
};