import * as THREE from "three";
import RoadSystem from './roads/RoadSystem';
import RoadMesh from './roads/RoadMesh';
import ProceduralTerrain from './ProceduralTerrain';
import ProceduralMap from './ProceduralMap';

/*
  ProceduralWorld
*/

export default class ProceduralWorld{
  constructor(manager){
    this.manager = manager;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 5;

    this.terrain = new ProceduralTerrain(this, {
      size: [500,500],
      detail: 128.0,
      amplitude: 300
    });

    this.roadSystem = new RoadSystem(this,this.terrain);

    this.roadMesh = new RoadMesh(this,this.roadSystem);

    window.addEventListener('mousemove', (e)=>this.onMouseMove(e), false);
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    this.roadSystem.setup();
    this.roadSystem.setupDebug();
  }

  onMouseMove(e){
    e.preventDefault();

    let mouse = new THREE.Vector2();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    this.roadSystem.updateMousePicker(mouse, true, true);
  }
}
