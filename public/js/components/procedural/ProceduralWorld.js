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

    this.terrain = new ProceduralTerrain(this, {
      size: [500,500],
      detail: 128.0,
      amplitude: 300
    });

    this.roads = new ProceduralRoads(this, {
      terrain: this.terrain
    });
  }

  setup(){
    this.terrain.setup();
    this.terrain.setupDebug();

    this.roads.setup();
    this.roads.setupDebug();
  }
}
