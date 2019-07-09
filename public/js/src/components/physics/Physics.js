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

let Ammo = '';
class Physics extends React.Component {
    static contextType = SketchContext;

    constructor(props, context) {
        super(props, context);

        this.scene = context.scene;

        this.phys = {};
        this.bodies = []; // array of rigid bodies
        this.tmpTrans = '';

        AMMO().then((A) => this.initPhysics(A));
    }

    initPhysics(A) {
        Ammo = A;
        this.tmpTrans = new Ammo.btTransform();

        // default phys configuration, initialize collision detection stack allocator
        this.phys.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();

        // dispatcher is responsible for collision calculations, with broadphase.
        this.phys.dispatcher = new Ammo.btCollisionDispatcher(
            this.phys.collisionConfiguration
        );

        // allows detection of aabb-overlapping object pairs
        this.phys.broadphase = new Ammo.btDbvtBroadphase();

        this.phys.solver = new Ammo.btSequentialImpulseConstraintSolver();

        // allows for rigid body simulation
        this.phys.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
            this.phys.dispatcher,
            this.phys.broadphase,
            this.phys.solver,
            this.phys.collisionConfiguration
        );

        this.phys.physicsWorld.setGravity(new Ammo.btVector3(0, - 6, 0));

        

        this.createBox();
        this.createSphere();


        this.props.onRef(this);
    }

    update(deltaTime) {
        // console.log(deltaTime);
        // Step world
        this.phys.physicsWorld.stepSimulation(deltaTime, 10);

        // Update rigid bodies
        for (let i = 0; i < this.bodies.length; i++) {
            let objThree = this.bodies[i];
            let objAmmo = objThree.userData.physicsBody;
            let ms = objAmmo.getMotionState();

            if (ms) {
                ms.getWorldTransform(this.tmpTrans);
                let p = this.tmpTrans.getOrigin();
                let q = this.tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

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
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        this.phys.physicsWorld.addRigidBody(body);

        // blockPlane.userData.physicsBody = body;
        // this.bodies.push(blockPlane);        
    }

    createSphere(){
        let pos = { x: 0, y: 20, z: 0 };
        let radius = 2;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 1;

        //threeJS Section
        let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({ color: 0xff0505 }));

        ball.position.set(pos.x, pos.y, pos.z);

        ball.castShadow = true;
        ball.receiveShadow = true;

        this.scene.add(ball);


        //Ammojs Section
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        this.phys.physicsWorld.addRigidBody(body);

        ball.userData.physicsBody = body;
        this.bodies.push(ball);
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
            </Paper>
        );
    }
}

export default withStyles(styles)(Physics);