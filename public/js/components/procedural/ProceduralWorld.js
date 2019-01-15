import * as THREE from "three";
import ProceduralRoads from './ProceduralRoads';
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

    this.roads = new ProceduralRoads(this, {
      terrain: this.terrain
    });

    window.addEventListener('mousemove', (e)=>this.onMouseMove(e), false);
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    this.roads.setup();
    this.roads.setupDebug();
  }

  onMouseMove(e){
    e.preventDefault();

    let mouse = new THREE.Vector2();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    this.roads.updateRoadChooser(mouse);
    this.roads.updateBlockChooser(mouse);
  }
}
