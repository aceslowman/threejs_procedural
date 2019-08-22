import React from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import SketchContext from '../../../../SketchContext';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';

// ui inputs
import VectorInput from './inputs/VectorInput';
import FloatInput from './inputs/FloatInput';
import BoolInput from './inputs/BoolInput';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class FirstPersonCamera extends React.Component {
    static contextType = SketchContext;

    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;
        this.camera = props.camera;

        this.state = {
            focalLength: 0,
            sensitivity: 20,
            sprint_sensitivity: 80,
            axisLock: false,
            noGravity: false,
            pointerLock: false
        };
    }

    setupFirstPersonCamera() {
        let pos = { x: 0, y: 100, z: 0 };
        let radius = 5;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 30;

        //create mesh ----------------------------
        this.fpTransform = new THREE.Mesh(
            new THREE.SphereBufferGeometry(radius, 16, 16),
            new THREE.MeshNormalMaterial()
        );

        this.fpTransform.position.set(pos.x, pos.y, pos.z);
        this.fpTransform.castShadow = true;
        this.fpTransform.receiveShadow = true;

        this.context.scene.add(this.fpTransform);

        //create rigidbody ----------------------------
        let transform = new this.context.physics.Ammo.btTransform();
        transform.setIdentity();

        // set default position
        transform.setOrigin(new this.context.physics.Ammo.btVector3(pos.x, pos.y, pos.z));
        // set default rotation
        transform.setRotation(new this.context.physics.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new this.context.physics.Ammo.btDefaultMotionState(transform);
        let colShape = new this.context.physics.Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new this.context.physics.Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new this.context.physics.Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        this.fp_body = new this.context.physics.Ammo.btRigidBody(rbInfo);

        // lock axis to keep camera upright. TODO: make toggleable
        this.fp_body.setAngularFactor(new this.context.physics.Ammo.btVector3(this.state.axisLock, 0, this.state.axisLock));

        // toggle gravity TODO: make toggleable
        this.fp_body.useGravity = false;

        this.fp_body.setActivationState(4);
        this.fp_body.setFriction(0);

        this.context.physics.physicsWorld.addRigidBody(this.fp_body);

        this.fp_body.setGravity(new this.context.physics.Ammo.btVector3(0, 0, 0));

        this.fpTransform.userData.physicsBody = this.fp_body;
        this.context.physics.bodies.push(this.fpTransform);

        // bind to camera prop
        this.fpTransform.add(this.camera);
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();
    }

    move(e) {
        if(this.state.pointerLock){
            const mode = 0;
            let sensitivity = mode ? this.state.sensitivity * 100 : this.state.sensitivity;

            sensitivity += this.state.sprint ? this.state.sprint_sensitivity : 0;

            let body = this.fp_body;

            // apply force in DIRECTION
            let direction = new THREE.Vector3();
            let axis = '';
            let d = '';

            this.camera.getWorldDirection(direction);

            direction.normalize();
            switch (e.code) {
                case "KeyW": // FORWARD
                    d = direction.multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    }

                    break;
                case "KeyS": // BACKWARD
                    d = direction.multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(-d.x, -d.y, -d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(-d.x, -d.y, -d.z));
                    }

                    break;
                case "KeyA": // LEFT
                    /*
                        NOTE: d.y is being discarded, which means left or right directions don't
                        affect elevation
                    */

                    axis = new THREE.Vector3(0, 1, 0);
                    d = direction.applyAxisAngle(axis, Math.PI / 2).multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, 0, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, 0, d.z));
                    }

                    break;
                case "KeyD": // RIGHT
                    /*
                        NOTE: d.y is being discarded, which means left or right directions don't
                        affect elevation
                    */

                    axis = new THREE.Vector3(0, -1, 0);
                    d = direction.applyAxisAngle(axis, Math.PI / 2).multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, 0, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, 0, d.z));
                    }

                    break;
                case "Space": // JUMP
                    body.applyImpulse(new this.context.physics.Ammo.btVector3(0,sensitivity*10,0));
                    break;
            }
            // TODO: break this into two different modes. impulse/velocity
        }
    }

    stop(e){
        let body = this.fp_body;

        switch (e.code) {
            case "KeyW":
                body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0,0,0));
                break;
            case "KeyA":
                body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0,0,0));
                break;
            case "KeyS":
                body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0,0,0));
                break;
            case "KeyD":
                body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0,0,0));
                break;
            case "Space":
                body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                break;
        }
        // TODO: break this into two different modes. impulse/velocity
    }

    look(e){
        if(this.state.pointerLock){
            let euler = new THREE.Euler(0, 0, 0, 'YXZ');

            var PI_2 = Math.PI / 2;

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            euler.setFromQuaternion(this.camera.quaternion);

            euler.y -= movementX * 0.002;
            euler.x -= movementY * 0.002;

            euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

            this.camera.quaternion.setFromEuler(euler);
        }
    }

    componentDidMount(){
        this.setupFirstPersonCamera();
        if(this.props.default) this.props.setActive("FirstPerson");
        this.registerListeners();
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    onPointerlockError() {
        console.error('Unable to use Pointer Lock API');
    }

    onPointerlockChange() {
        let canvas = this.context.renderer.domElement;

        if (document.pointerLockElement !== canvas){
            this.setState({pointerLock: false})
            canvas.style.boxSizing = "border-box";
            canvas.style.border = "";
        }else{
            canvas.style.boxSizing = "border-box";
            canvas.style.border = "4px solid blue";
        }
    }

    onClick(){
        let canvas = this.context.renderer.domElement;
        let lock = !this.state.pointerLock;

        !this.state.pointerLock ? canvas.requestPointerLock() : document.exitPointerLock()
        
        this.setState({pointerLock: !this.state.pointerLock})
    }

    onKeyDown(e){
        // console.log(e.code)
        switch (e.code) {
            case "ShiftLeft":
                this.setState({sprint: true})
                break;
        }

        this.move(e);
    }

    onKeyUp(e){
        // console.log(e.code)
        switch (e.code) {
            case "ShiftLeft":
                this.setState({sprint: false})
                break;
        }

        this.stop(e);
    }   

    registerListeners() {
        let canvas = this.context.renderer.domElement;

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('pointerlockchange', () => this.onPointerlockChange(), false);
        document.addEventListener('pointerlockerror', () => this.onPointerlockError(), false);
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('mousemove', (e)=> this.look(e))
    }

    removeListeners() {
        let canvas = this.context.renderer.domElement;

        document.removeEventListener('keydown', (e) => this.onKeyDown(e));
        document.removeEventListener('keyup', (e) => this.onKeyUp(e));
        document.removeEventListener('pointerlockchange', () => this.onPointerlockChange(), false);
        document.removeEventListener('pointerlockerror', () => this.onPointerlockError(), false);
        canvas.removeEventListener('mousemove', (e)=> this.look(e));
        canvas.removeEventListener('click', (e) => this.onClick(e));
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={12}>
                <BoolInput 
                     value={this.state.lock_axis}
                     name="Lock Axis"
                />
                <BoolInput 
                     value={this.state.no_grav}
                     name="Gravity On/Off"
                />
                <FloatInput 
                     value={this.state.sensitivity}
                     name="Lock Axis"
                />
            </Grid>
        );
    }
};

export default withStyles(styles)(FirstPersonCamera);