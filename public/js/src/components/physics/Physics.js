import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SketchContext from "../../SketchContext";
import AMMO from 'ammo.js';
import { Divider } from '@material-ui/core';

import * as THREE from 'three';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

class Physics extends React.Component {
    static contextType = SketchContext;

    constructor(props, context) {
        super(props, context);

        this.scene = context.scene;

        this.bodies = []; // array of rigid bodies
        this.testObjects = []; // array of meshes
        this.tmpTrans = '';
        this.Ammo = '';

        AMMO().then((A) => this.initPhysics(A));
    }

    initPhysics(A) {
        this.Ammo = A;
        this.tmpTrans = new this.Ammo.btTransform();

        // default configuration, initialize collision detection stack allocator
        this.collisionConfiguration = new this.Ammo.btDefaultCollisionConfiguration();

        // dispatcher is responsible for collision calculations, with broadphase.
        this.dispatcher = new this.Ammo.btCollisionDispatcher(
            this.collisionConfiguration
        );

        // allows detection of aabb-overlapping object pairs
        this.broadphase = new this.Ammo.btDbvtBroadphase();

        this.solver = new this.Ammo.btSequentialImpulseConstraintSolver();

        // allows for rigid body simulation
        this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(
            this.dispatcher,
            this.broadphase,
            this.solver,
            this.collisionConfiguration
        );

        this.physicsWorld.setGravity(new this.Ammo.btVector3(0, -9.82, 0));

        this.props.onRef(this);

        this.triggerTestPhysics(30,256,80,1);
    }

    triggerTestPhysics(num_obj, width, height, radius){
        // clear all bodies
        for (let body of this.bodies){
            console.log(body);
            console.log(body.userData.physicsBody);
            // body.userData.physicsBody.destroy();
            // this.Ammo.destroy(body.userData.physicsBody);
            this.context.scene.remove(body);
        }

        // store these separately in a 'test bodies' array.

        this.bodies = []; // TODO: probably a memory leak

        let padding = width / num_obj;
        let offset  = -width / 2;

        for (let x = 0; x <= num_obj; x++) {
            for (let z = 0; z <= num_obj; z++) {
                this.initializeTestPhysics(x * (padding) + offset, height, z * (padding) + offset, radius);
            }
        }
    }

    initializeTestPhysics(x,y,z,rad) {
        let pos = { x: x, y: y, z: z };
        let radius = rad;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 1;

        //threeJS Section
        let ball = new THREE.Mesh(
            new THREE.SphereBufferGeometry(radius, 8, 8),
            new THREE.MeshBasicMaterial({
                color: 'red',
                depthTest: true,
                wireframe: true
            })
        );

        ball.position.set(pos.x, pos.y, pos.z);

        ball.castShadow = true;
        ball.receiveShadow = true;

        this.context.scene.add(ball);


        //Ammojs Section
        let transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new this.Ammo.btDefaultMotionState(transform);

        let colShape = new this.Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new this.Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new this.Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new this.Ammo.btRigidBody(rbInfo);

        this.physicsWorld.addRigidBody(body);

        ball.userData.physicsBody = body;
        this.bodies.push(ball);
    }

    update(deltaTime) {
        // console.log(deltaTime);
        // Step world
        this.physicsWorld.stepSimulation(deltaTime, 10);

        // Update rigid bodies
        for (let i = 0; i < this.bodies.length; i++) {
            let objThree = this.bodies[i];
            let objAmmo = objThree.userData.physicsBody;

            let ms = objAmmo.getMotionState();

            // objAmmo.setLinearVelocity(this.Ammo.btVector3(0, 0, 0));
            // objAmmo.setLinearVelocity(this.Ammo.btVector3(100, 0, 0));
            
            if (ms) {
                // console.log(ms);
                ms.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }   
    }

    /*
        TODO: turn this into a boundary box that removes rigidbodies
    */
    createBox(){
        let pos = { x: 0, y: 0, z: 0 };
        let scale = { x: 50, y: 2, z: 50 };
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 0;

        //threeJS Section
        let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));

        blockPlane.position.set(pos.x, pos.y, pos.z);
        blockPlane.scale.set(scale.x, scale.y, scale.z);

        blockPlane.castShadow = true;
        blockPlane.receiveShadow = true;

        this.scene.add(blockPlane);


        //Ammojs Section
        let transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new this.Ammo.btDefaultMotionState(transform);

        let colShape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
        colShape.setMargin(0.05);

        let localInertia = new this.Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new this.Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new this.Ammo.btRigidBody(rbInfo);

        this.physicsWorld.addRigidBody(body);

        // blockPlane.userData.physicsBody = body;
        // this.bodies.push(blockPlane);        
    }

    render(){
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid
                    container
                    justify={'space-around'}
                    alignItems={'center'}
                    spacing={16}
                >
                    <Typography variant="h5" gutterBottom>Physics</Typography>
                </Grid>
                <Divider />
                <Grid item>
                    <button onClick={() => this.triggerTestPhysics(20, 128, 80, 1)} >Trigger Physics Test</button>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(Physics);