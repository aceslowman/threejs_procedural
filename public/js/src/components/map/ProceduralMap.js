import React from 'react';
import SketchContext from '../../SketchContext';

import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

export default class ProceduralMap extends React.Component {
    static contextType = SketchContext;
    
    constructor(props, context){
        super(props);

        if(!props.children) console.error("no passes have been defined for map! make sure that valid passes have been provided as prop children.");

        this.passes   = props.children;
        this.renderer = context.renderer;
        this.scene    = context.scene;
        this.width    = props.width  || 256;
        this.height   = props.height || 256;
        this.seed     = props.seed || Math.random() * 10000;
        this.name     = props.name || "default map";
    }

    //------------------------------------------------------------------------
    componentWillMount() {
        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,       // important for readPixels()
            type: THREE.FloatType,          // important for readPixels()
            stencilBuffer: false
        });

        this.composer = new EffectComposer(this.renderer, this.target);
        this.composer.setSize(this.width, this.height);

        /*
            if I wait to render the composer until AFTER everything is ready,
            I can actually see the effect of the FractalWarp. Is this some 
            issue related to the order these components are being generated?

            how can I test this?

            - create an 'updateMap' ui element.
                -- doesn't do anything. still outputs only the first pass.
            
            - how is the tDiffuse texture actually binding to FractalWarp? 
                -- it isn't set after addPass(), what about in EffectComposer.render()?
                    --- it's set in ShaderPass.render(), which assigns the readBuffer to
                        the corresponding texture uniform (that matches the name of the
                        shaderpass textureID, ie tDiffuse)
            
            - FractalWarp is WORKING, but I seem to be sending only the FractalNoise output. 
                    
            
            - when I set the renderer.autoClear to false, I can see it flash one (correct)
              frame from the EffectComposer. this makes me think that the renderToScreen 
              quad is being displayed, but immediately drawn on top of. so it's rendering FIRST
                -- could this mean that the rendering of the scene is happening before 
                   the rendering of the effectcomposer?
                -- it at least means that FractalNoise is working
                -- THIS.ELEVATION is being set onRef()!!! is it not being updated?

            - log when *all* components get mounted, and inspect.
                -- verbose mode?
        */
    }

    componentDidMount(){
        this.updateComposer();
    }

    //------------------------------------------------------------------------
    addPass(pass) {
        this.composer.addPass(pass);
    }

    updateComposer(){
        this.composer.render();
        this.props.onRef(this);
        this.props.displaceGeometry(this.getBufferArray());
    }

    updatePassParam(pass_id, name, value) {
        this.composer.passes[pass_id][name] = value;
        this.updateComposer();
    }

    updatePassDefine(pass_id, name, value) {
        this.composer.passes[pass_id].material.defines[name] = value;
        this.composer.passes[pass_id].material.needsUpdate = true;
        this.updateComposer();
    }

    updatePassUniform(pass_id, name, value) {
        this.composer.passes[pass_id].uniforms[name].value = value;
        this.updateComposer();
    }

    //------------------------------------------------------------------------
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

    //------------------------------------------------------------------------
    render() {
        return(
            <React.Fragment>
                <button onClick={()=>this.updateComposer()}>UpdateComposer</button>
                <button onClick={() => this.composer.swapBuffers()}>Swap Buffers</button>
                <button onClick={()=>this.composer.reset()}>reset composer</button>

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