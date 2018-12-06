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
      size: [128,128],
      time: Math.random()*1000,
      bSmooth: true,
      map: [0,2],
      scale: [0.1,0.1],
      offset: [0,0],
      octaves: 6
    });

    this.population = new ProceduralMap(this, {
      size: [128,128],
      time: Math.random()*1000,
      bSmooth: true,
      map: [-1,1],
      scale: [1,1],
      offset: [0,0],
      octaves: 2
    });

    this.terrain = new ProceduralTerrain(this, {
      size: [1,1],
      elevation: this.elevation,
      detail: 128.0,
      amplitude: 1.0
    });

    this.roads = new ProceduralRoads(this, {
      population: this.population,
      terrain: this.terrain
    });

    this.setup();
    this.addToScene();
  }

  setup(){
    this.terrain.setup();
    this.roads.setup();
    this.population.setupDisplay();

    this.setupGUI();
  }

  update(){}

  addToScene(){
    // this.scene.add(this.terrain.mesh);
    this.scene.add(this.roads.pointsMesh);
    this.scene.add(this.roads.crossingsMesh);
    this.scene.add(this.roads.lineSegmentsMesh);
    this.manager.addEntity(this);
  }

  setupGUI(){
    // this.gui.roads = this.gui.addFolder("Road");
    // this.gui.roads.add(this.roads.material,"wireframe");

    this.gui.terrain = this.gui.addFolder("Terrain");
    this.gui.terrain.add(this.terrain.mesh,"visible");
    this.gui.terrain.add(this.terrain.material,"wireframe");
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_elev,'value',0,1).name('Show Elev');
    this.gui.terrain.add(this.terrain.elev_uniforms.draw_topo,'value',0,1).name('Show Topo');

    this.gui.elevation = this.gui.addFolder("Elevation");
    // this.gui.elevation.add(this.elevation.outputQuad,"visible");
    // this.gui.elevation.add(this.elevation.uniforms.map,"value",[-2,-2],[2,2]).name("map");
    // this.gui.elevation.add(this.elevation.uniforms.scale,"value",[-10,-10],[10,10]).name("scale");
    // this.gui.elevation.add(this.elevation.uniforms.octaves,"value",0,12).name("octaves");
  }
}
