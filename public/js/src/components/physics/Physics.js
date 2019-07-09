import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SketchContext from "../../SketchContext";
import Ammo from 'ammo.js';
import { Divider } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: 8,
        margin: '4px 4px 16px 4px'
    }
});

let AMMO = '';

class Physics extends React.Component {
    static contextType = SketchContext;

    constructor(props, context) {
        super(props, context);

        this.phys = {};

        Ammo().then((AmmoLib) => this.initPhysics(AmmoLib));
    }

    initPhysics(AmmoLib) {
        AMMO = AmmoLib;

        // TODO: attempting to set up basic physics world, using ammo
        // this will likely need to be moved to a new comp, and fed thru
        // context, similar to the renderer

        // Physics configuration
        this.phys.collisionConfiguration = new AMMO.btDefaultCollisionConfiguration();
        this.phys.dispatcher = new AMMO.btCollisionDispatcher(
            this.phys.collisionConfiguration
        );

        this.phys.broadphase = new AMMO.btDbvtBroadphase();
        this.phys.solver = new AMMO.btSequentialImpulseConstraintSolver();

        this.phys.physicsWorld = new AMMO.btDiscreteDynamicsWorld(
            this.phys.dispatcher,
            this.phys.broadphase,
            this.phys.solver,
            this.phys.collisionConfiguration
        );

        this.phys.physicsWorld.setGravity(new AMMO.btVector3(0, - 6, 0));

        console.log(this.phys.physicsWorld);

        // it is initializing

        // can I just send this to the components using context?
        // it appears I can.

        var groundShape = new AMMO.btBoxShape(new AMMO.btVector3(50, 50, 50)),
            bodies = [],
            groundTransform = new AMMO.btTransform();

        groundTransform.setIdentity();
        groundTransform.setOrigin(new AMMO.btVector3(0, -56, 0));


        var mass = 0,
            isDynamic = (mass !== 0),
            localInertia = new AMMO.btVector3(0, 0, 0);

        if (isDynamic)
            groundShape.calculateLocalInertia(mass, localInertia);

        var myMotionState = new AMMO.btDefaultMotionState(groundTransform),
            rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia),
            body = new AMMO.btRigidBody(rbInfo);

        this.phys.physicsWorld.addRigidBody(body);
        bodies.push(body);



        var colShape = new AMMO.btSphereShape(1),
            startTransform = new AMMO.btTransform();

        startTransform.setIdentity();

        var mass = 1,
            isDynamic = (mass !== 0),
            localInertia = new AMMO.btVector3(0, 0, 0);

        if (isDynamic)
            colShape.calculateLocalInertia(mass, localInertia);

        startTransform.setOrigin(new AMMO.btVector3(2, 10, 0));

        var myMotionState = new AMMO.btDefaultMotionState(startTransform),
            rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia),
            body = new AMMO.btRigidBody(rbInfo);

        this.phys.physicsWorld.addRigidBody(body);
        bodies.push(body);




        var trans = new AMMO.btTransform(); // taking this out of the loop below us reduces the leaking

        for (var i = 0; i < 135; i++) {
            this.phys.physicsWorld.stepSimulation(1 / 60, 10);

            bodies.forEach(function (body) {
                if (body.getMotionState()) {
                    body.getMotionState().getWorldTransform(trans);
                    console.log("world pos = " + [trans.getOrigin().x().toFixed(2), trans.getOrigin().y().toFixed(2), trans.getOrigin().z().toFixed(2)]);
                }
            });
        }

        // Delete objects we created through |new|. We just do a few of them here, but you should do them all if you are not shutting down ammo.js
        // we'll free the objects in reversed order as they were created via 'new' to avoid the 'dead' object links
        // AMMO.destroy(this.phys.physicsWorld);
        // AMMO.destroy(solver);
        // AMMO.destroy(overlappingPairCache);
        // AMMO.destroy(dispatcher);
        // AMMO.destroy(collisionConfiguration);

        // print('ok.')
        console.log('ok.');
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