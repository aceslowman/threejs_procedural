import * as THREE from "three";
import ProceduralRoads from '../components/procedural/ProceduralRoads';
import ProceduralTerrain from '../components/procedural/ProceduralTerrain';
import ProceduralMap from '../components/procedural/ProceduralMap';

/*
  City
*/

export default class City{

  constructor(manager){
    this.manager = manager;
    this.clock = manager.clock;
    this.scene = manager.scene;
    this.gui = manager.gui;

    this.elevation = new ProceduralMap(this, {
      size: [256,256],
      frequency: 50,
      range: [0,1],
      octaves: 5
    });

    this.population = new ProceduralMap(this, {
      size: [256,256],
      frequency: 50,
      range: [0,1],
      octaves: 5
    });

    this.terrain = new ProceduralTerrain(this, {
      size: [1,1],
      elevation: this.elevation,
      detail: 256.0,
      amplitude: 0.3
    });

    this.roads = new ProceduralRoads(this, {
      population: this.population
    });

    this.setup();
    this.addToScene();
  }

  setup(){
    this.terrain.setup();
    this.roads.setup();
    this.elevation.setupDisplay();

    this.setupGUI();
  }

  update(){}

  addToScene(){
    this.scene.add(this.terrain.mesh);
    this.scene.add(this.roads.pointsMesh);
    this.scene.add(this.roads.crossingsMesh);
    this.scene.add(this.roads.lineSegmentsMesh);
    this.manager.addEntity(this);
  }

  setupGUI(){
    // this.gui.roads = this.gui.addFolder("Road");
    // this.gui.roads.add(this.roads.material,"wireframe");

    this.gui.terrain = this.gui.addFolder("Terrain");
    this.gui.terrain.add(this.terrain.material,"wireframe");
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');
  }
}
