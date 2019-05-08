import * as THREE from 'three';
import Roads from './roads/Roads';
import Terrain from './terrain/Terrain';

/*
  World
*/

export default class World{
  constructor(manager){
    this.manager = manager;

    this.width = 500; // in worldspace
    this.height = 500; // in worldspace

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 5;

    this.terrain = new Terrain(this, {
      size: [this.width,this.height],
      detail: 128.0,
      amplitude: 300
    });

    // this.roads = new Roads(this);

    this.setup();
    this.addToScene();

    window.addEventListener('mousemove', (e)=>this.onMouseMove(e), false);
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    // this.roads.setup();
    // this.roads.setupDebug();

    // this.terrain.elevation.setupDisplay(
    //   'elevation',
    //   new THREE.Vector2((-this.manager.width/2.0) + 148,-128)
    // );
    // this.roads.system.population.setupDisplay(
    //   'population',
    //   new THREE.Vector2((-this.manager.width/2.0) + 148,128)
    // );

    this.setupGUI();
  }

  onMouseMove(e){
    e.preventDefault();

    let mouse = new THREE.Vector2();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    // this.roads.onMouseMove(e, mouse);
  }

  addToScene(){
    this.manager.addEntity(this);
  }

  update(){
    // this.roads.updateDebug();
  }

  setupGUI(){
    // this.roads.setupGUI();
    this.terrain.setupGUI();
  }
}
