import React from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import SketchContext from '../../../../SketchContext';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';

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
        this.fp_body.setAngularFactor(this.context.physics.Ammo.btVector3(this.state.axisLock, 0, this.state.axisLock));

        // toggle gravity TODO: make toggleable
        this.fp_body.setGravity(this.context.physics.Ammo.btVector3(0,0,0));

        this.fp_body.setActivationState(4);
        this.fp_body.setFriction(0);

        this.context.physics.physicsWorld.addRigidBody(this.fp_body);

        this.fpTransform.userData.physicsBody = this.fp_body;
        this.context.physics.bodies.push(this.fpTransform);

        // bind to camera prop
        this.fpTransform.add(this.camera);
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();
    }

    move(e) {
        if(this.state.pointerLock){
            // if (!this.state.locked) {
            const mode = 0;
            const sensitivity = mode ? this.state.sensitivity * 100 : this.state.sensitivity;

            let body = this.fp_body;

            // apply force in DIRECTION
            let direction = new THREE.Vector3();
            let axis = '';
            let d = '';

            this.camera.getWorldDirection(direction);

            direction.normalize();
            switch (e.code) {
                case "KeyW":
                    d = direction.multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    }

                    break;
                case "KeyA":
                    axis = new THREE.Vector3(0, 1, 0);
                    d = direction.applyAxisAngle(axis, Math.PI / 2).multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    }

                    break;
                case "KeyS":
                    axis = new THREE.Vector3(0, 1, 0);
                    d = direction.applyAxisAngle(axis, Math.PI).multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    }

                    break;
                case "KeyD":
                    axis = new THREE.Vector3(0, -1, 0);
                    d = direction.applyAxisAngle(axis, Math.PI / 2).multiplyScalar(sensitivity);
                    if (mode) {
                        body.applyForce(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    } else {
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0, 0, 0));
                        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(d.x, d.y, d.z));
                    }

                    break;
                case "Space":
                    body.applyImpulse(new this.context.physics.Ammo.btVector3(0,sensitivity*10,0));
                    break;
            }
            // TODO: break this into two different modes. impulse/velocity
        }
    }

    stop(e){
        let body = this.fp_body;
        body.setLinearVelocity(new this.context.physics.Ammo.btVector3(0,0,0));
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

    registerListeners() {
        let canvas = this.context.renderer.domElement;

        document.addEventListener('keydown', (e) => this.move(e));
        document.addEventListener('keyup', (e) => this.move(e));
        document.addEventListener('pointerlockchange', () => this.onPointerlockChange(), false);
        document.addEventListener('pointerlockerror', () => this.onPointerlockError(), false);
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('mousemove', (e)=> this.look(e))
    }

    removeListeners() {
        let canvas = this.context.renderer.domElement;

        document.removeEventListener('keydown', (e) => this.move(e));
        document.removeEventListener('keyup', (e) => this.move(e));
        document.removeEventListener('pointerlockchange', () => this.onPointerlockChange(), false);
        document.removeEventListener('pointerlockerror', () => this.onPointerlockError(), false);
        canvas.removeEventListener('mousemove', (e)=> this.look(e));
        canvas.removeEventListener('click', (e) => this.onClick(e));
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={12}>
                
            </Grid>
        );
    }
};

export default withStyles(styles)(FirstPersonCamera);